export interface Env {
	blog_comments: D1Database;
	AI: Ai;
	RESEND_API_KEY: string;
	JWT_SECRET: string;
	ALLOWED_ORIGIN: string;
	BLOG_URL: string;
}

// ─── JWT ─────────────────────────────────────────────────────────────────────

async function signJWT(payload: Record<string, unknown>, secret: string): Promise<string> {
	const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
	const body = btoa(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }));
	const data = `${header}.${body}`;
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	);
	const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
	const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
	return `${data}.${sigB64}`;
}

async function verifyJWT(
	token: string,
	secret: string,
): Promise<{ userId: string; name: string } | null> {
	try {
		const [header, body, sig] = token.split('.');
		if (!header || !body || !sig) return null;
		const data = `${header}.${body}`;
		const key = await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(secret),
			{ name: 'HMAC', hash: 'SHA-256' },
			false,
			['verify'],
		);
		const sigBytes = Uint8Array.from(atob(sig), (c) => c.charCodeAt(0));
		const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
		if (!valid) return null;
		const payload = JSON.parse(atob(body)) as { userId: string; name: string; exp: number };
		if (payload.exp < Math.floor(Date.now() / 1000)) return null;
		return { userId: payload.userId, name: payload.name };
	} catch {
		return null;
	}
}

// ─── Email ───────────────────────────────────────────────────────────────────

async function sendMagicLinkEmail(
	env: Env,
	email: string,
	name: string,
	verifyUrl: string,
): Promise<void> {
	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: 'Blog <noreply@notificaciones.cardila.com>',
			to: email,
			subject: 'Tu enlace para comentar en el blog',
			html: `
				<p>Hola ${name},</p>
				<p>Haz clic en el siguiente enlace para verificar tu email y publicar tu comentario:</p>
				<p><a href="${verifyUrl}" style="font-size:18px;font-weight:bold">Verificar mi email</a></p>
				<p>Este enlace expira en 15 minutos. Si no solicitaste esto, ignora este correo.</p>
			`,
		}),
	});
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Resend error: ${err}`);
	}
}

async function sendNewCommentNotification(
	env: Env,
	authorName: string,
	content: string,
	postSlug: string,
): Promise<void> {
	const postUrl = `${env.BLOG_URL}${postSlug}/`;
	const preview = content.length > 200 ? content.slice(0, 200) + '…' : content;
	await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: 'Blog <noreply@notificaciones.cardila.com>',
			to: 'carlos@ardila.com.co',
			subject: `Nuevo comentario de ${authorName}`,
			html: `
				<p><strong>${authorName}</strong> dejó un comentario en tu blog:</p>
				<blockquote style="border-left:3px solid #2bbc8a;margin:12px 0;padding:8px 16px;color:#555">
					${preview.replace(/\n/g, '<br>')}
				</blockquote>
				<p><a href="${postUrl}">Ver el post →</a></p>
			`,
		}),
	});
}

// ─── Blocklist pre-filter ─────────────────────────────────────────────────────

const BLOCKED_WORDS = [
	// Spanish insults
	'idiota', 'idiotas', 'imbécil', 'imbecil', 'imbéciles', 'imbeciles',
	'estúpido', 'estupido', 'estúpida', 'estupida', 'estúpidos', 'estupidos',
	'pendejo', 'pendeja', 'pendejos', 'pendejas',
	'maricón', 'maricon', 'marica',
	'puta', 'puto', 'putas', 'putos',
	'mierda', 'mierdas',
	'hdp', 'hpta', 'hijueputa', 'hijueputas',
	'cabrón', 'cabron', 'cabrona', 'cabrones',
	'coño', 'cono',
	'basura', 'inútil', 'inutil',
	'maldito', 'maldita', 'malditos',
	// English insults
	'idiot', 'idiots', 'moron', 'morons', 'stupid', 'asshole', 'assholes',
	'bastard', 'bastards', 'bitch', 'bitches', 'damn', 'fuck', 'fucking',
	'shit', 'crap', 'dumbass', 'loser', 'retard',
];

function hasBlockedWord(content: string): boolean {
	const lower = content.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
	const normalizedList = BLOCKED_WORDS.map(w => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''));
	return normalizedList.some(word => {
		const re = new RegExp(`(?<![a-záéíóúüñ])${word}(?![a-záéíóúüñ])`, 'i');
		return re.test(lower);
	});
}

// ─── Moderation ──────────────────────────────────────────────────────────────

async function moderateComment(env: Env, content: string): Promise<{ verdict: 'approved' | 'spam'; reason: string }> {
	if (hasBlockedWord(content)) {
		return { verdict: 'spam', reason: 'contiene lenguaje inapropiado' };
	}
	try {
		const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
			messages: [
				{
					role: 'system',
					content:
						'You are a blog comment moderator. Comments may be in any language, especially Spanish. Reply ONLY with valid JSON: {"verdict":"approved","reason":"..."} or {"verdict":"spam","reason":"..."}. ' +
						'APPROVE: genuine opinions, questions, and feedback — even if blunt or critical. Examples: "this is wrong", "I disagree", "esto está mal", "no estoy de acuerdo". ' +
						'REJECT as spam: ads, promotional links, gibberish, hate speech, threats, or direct personal insults. ' +
						'Personal insults include: "you are an idiot", "go to hell", "eres un idiota", "eres estúpido", "qué imbécil", "idiota", "estúpido", "imbécil", "pendejo", "eres una basura", or similar disrespectful attacks targeting a person. ' +
						'Critique the idea = OK. Attack the person = REJECT.',
				},
				{ role: 'user', content },
			],
			max_tokens: 80,
		});
		const text = typeof result === 'object' && 'response' in result ? (result as { response: string }).response : String(result);
		const jsonMatch = text.match(/\{[^}]+\}/);
		if (jsonMatch) {
			const parsed = JSON.parse(jsonMatch[0]) as { verdict: string; reason: string };
			if (parsed.verdict === 'spam' || parsed.verdict === 'approved') {
				return parsed as { verdict: 'approved' | 'spam'; reason: string };
			}
		}
		// If the LLM response can't be parsed, default to approved to avoid false positives
		return { verdict: 'approved', reason: 'moderation parse fallback' };
	} catch {
		return { verdict: 'approved', reason: 'moderation error fallback' };
	}
}

// ─── CORS helper ─────────────────────────────────────────────────────────────

function corsHeaders(origin: string, allowedOrigin: string): Record<string, string> {
	const allowed = origin === allowedOrigin || origin === 'http://localhost:4321' ? origin : allowedOrigin;
	return {
		'Access-Control-Allow-Origin': allowed,
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	};
}

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json', ...extraHeaders },
	});
}

// ─── Router ──────────────────────────────────────────────────────────────────

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const origin = request.headers.get('Origin') ?? '';
		const cors = corsHeaders(origin, env.ALLOWED_ORIGIN);

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: cors });
		}

		const url = new URL(request.url);
		const path = url.pathname;

		try {
			// GET /api/comments?slug=...
			if (request.method === 'GET' && path === '/api/comments') {
				const slug = url.searchParams.get('slug');
				if (!slug) return json({ error: 'slug required' }, 400, cors);

				const rows = await env.blog_comments.prepare(
					"SELECT id, author_name, content, created_at, parent_id FROM comments WHERE post_slug = ? AND status = 'approved' ORDER BY created_at ASC",
				)
					.bind(slug)
					.all();

				return json(rows.results, 200, cors);
			}

			// POST /api/auth/magic-link
			if (request.method === 'POST' && path === '/api/auth/magic-link') {
				const body = (await request.json()) as { email?: string; name?: string; returnUrl?: string };
				const email = body.email?.trim().toLowerCase();
				const name = body.name?.trim();
				const returnUrl = body.returnUrl?.trim();

				if (!email || !name) return json({ error: 'El email y el nombre son requeridos' }, 400, cors);
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'El email no es válido' }, 400, cors);
				if (name.length < 2 || name.length > 60) return json({ error: 'El nombre debe tener entre 2 y 60 caracteres' }, 400, cors);

				// Validate returnUrl belongs to the blog domain
				let redirectBase = env.BLOG_URL;
				if (returnUrl) {
					try {
						const parsed = new URL(returnUrl);
						const allowed = new URL(env.BLOG_URL);
						if (parsed.hostname === allowed.hostname) redirectBase = returnUrl;
					} catch { /* use default */ }
				}

				const token = crypto.randomUUID();
				const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
				const id = crypto.randomUUID();

				await env.blog_comments.prepare(
					'INSERT INTO magic_tokens (id, email, name, token, expires_at) VALUES (?, ?, ?, ?, ?)',
				)
					.bind(id, email, name, token, expiresAt)
					.run();

				const verifyUrl = `${redirectBase}${redirectBase.includes('?') ? '&' : '?'}comment_token=${token}`;
				await sendMagicLinkEmail(env, email, name, verifyUrl);

				return json({ message: 'Magic link sent. Check your email.' }, 200, cors);
			}

			// GET /api/auth/verify?token=...
			if (request.method === 'GET' && path === '/api/auth/verify') {
				const token = url.searchParams.get('token');
				if (!token) return json({ error: 'token required' }, 400, cors);

				const row = await env.blog_comments.prepare(
					"SELECT * FROM magic_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')",
				)
					.bind(token)
					.first<{ id: string; email: string; name: string }>();

				if (!row) return json({ error: 'El enlace es inválido o ya expiró' }, 401, cors);

				await env.blog_comments.prepare('UPDATE magic_tokens SET used = 1 WHERE id = ?').bind(row.id).run();

				// Upsert user
				let user = await env.blog_comments.prepare('SELECT id, name FROM users WHERE email = ?')
					.bind(row.email)
					.first<{ id: string; name: string }>();

				if (!user) {
					const userId = crypto.randomUUID();
					await env.blog_comments.prepare('INSERT INTO users (id, email, name) VALUES (?, ?, ?)')
						.bind(userId, row.email, row.name)
						.run();
					user = { id: userId, name: row.name };
				}

				const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
				const jwt = await signJWT({ userId: user.id, name: user.name, exp }, env.JWT_SECRET);

				return json({ jwt, name: user.name }, 200, cors);
			}

			// POST /api/comments
			if (request.method === 'POST' && path === '/api/comments') {
				const authHeader = request.headers.get('Authorization') ?? '';
				const token = authHeader.replace('Bearer ', '');
				const auth = await verifyJWT(token, env.JWT_SECRET);
				if (!auth) return json({ error: 'No autorizado' }, 401, cors);

				const body = (await request.json()) as { slug?: string; content?: string; parent_id?: string };
				const slug = body.slug?.trim();
				const content = body.content?.trim();
				const parentId = body.parent_id?.trim() || null;

				if (!slug || !content) return json({ error: 'Faltan campos requeridos' }, 400, cors);
				if (content.length < 3) return json({ error: 'El comentario es demasiado corto' }, 400, cors);
				if (content.length > 2000) return json({ error: 'El comentario supera los 2000 caracteres' }, 400, cors);

				if (parentId) {
					const parent = await env.blog_comments.prepare(
						"SELECT id FROM comments WHERE id = ? AND post_slug = ? AND status = 'approved'",
					).bind(parentId, slug).first<{ id: string }>();
					if (!parent) return json({ error: 'El comentario al que intentas responder no existe' }, 400, cors);
				}

				const moderation = await moderateComment(env, content);

				if (moderation.verdict === 'spam') {
					return json({ error: 'Tu comentario no pudo publicarse porque contiene lenguaje inapropiado o spam.' }, 422, cors);
				}

				const user = await env.blog_comments.prepare('SELECT name FROM users WHERE id = ?')
					.bind(auth.userId)
					.first<{ name: string }>();

				const commentId = crypto.randomUUID();
				const now = new Date().toISOString();

				await env.blog_comments.prepare(
					"INSERT INTO comments (id, post_slug, user_id, author_name, content, status, created_at, parent_id) VALUES (?, ?, ?, ?, ?, 'approved', ?, ?)",
				)
					.bind(commentId, slug, auth.userId, user?.name ?? auth.name, content, now, parentId)
					.run();

				// Fire-and-forget: don't block the response if notification fails
				sendNewCommentNotification(env, user?.name ?? auth.name, content, slug).catch(() => {});

				return json(
					{ id: commentId, author_name: user?.name ?? auth.name, content, created_at: now, parent_id: parentId },
					201,
					cors,
				);
			}

			return json({ error: 'Not found' }, 404, cors);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			console.error('[Worker error]', msg);
			return json({ error: 'Internal server error', detail: msg }, 500, cors);
		}
	},
};
