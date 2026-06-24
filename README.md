# Carlos Ardila's Blog

This is the personal blog and website of **Carlos Ardila**, built with the [Astro Cactus Theme](https://github.com/chrismwilliams/astro-theme-cactus).

Visit the live site at: **[blog.cardila.com](https://blog.cardila.com)**

## About

This blog contains personal thoughts, movie reviews, technology articles, and various musings collected over the years. The site was migrated from WordPress to Astro in 2025 to take advantage of modern web technologies and improved performance.

## Tech Stack

- **Framework**: [Astro](https://astro.build) v6
- **Theme**: [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus)
- **Styling**: Tailwind CSS v4
- **Deployment**: GitHub Pages
- **Comments**: Custom system (Cloudflare Workers + D1 + Workers AI + Resend)

## Key Features

- Fast static site generation with Astro
- Dark & Light mode
- Responsive design
- Static search with Pagefind
- Auto-generated OG images with Satori
- RSS feeds
- MDX support
- **Image lightbox with automatic optimization** (see below)
- Custom reusable components (see below)

## Custom Components

This blog includes several custom Astro components designed for rich content:

- **MovieTrailerCard**: Display movie info with trailers from TMDB
- **MovieCard**: Display movie info from OMDB
- **BGGCard**: Display board game info from BoardGameGeek
- **Comments**: Custom email magic-link comment system (see below)

📖 **[See CUSTOM_COMPONENTS.md for detailed documentation and installation instructions](./CUSTOM_COMPONENTS.md)**

## Comment System

The blog uses a custom comment system built on Cloudflare's free tier, replacing Giscus (which required a GitHub account). Visitors can comment using only their name and email — no account needed.

### Architecture

```
blog.cardila.com (GitHub Pages, static)
  └─ Comments.astro (vanilla JS component)
       ├─ GET  /api/comments?slug=…      ─┐
       ├─ POST /api/auth/magic-link        │  Cloudflare Worker
       ├─ GET  /api/auth/verify?token=…   │  (blog-comments-worker)
       └─ POST /api/comments            ─┘
                                           ├─ D1 SQLite (users, tokens, comments)
                                           ├─ Workers AI — Llama 3.1 8B (spam moderation)
                                           └─ Resend API (magic link emails + notifications)
```

### Features

- **Email magic link auth** — visitors enter their name and email, receive a one-time link, and stay logged in for 30 days via JWT in localStorage. No passwords stored.
- **Nested replies** — comments can be replied to; replies appear indented below the parent comment.
- **Two-layer moderation** — a word blocklist catches common insults instantly; the LLM (Llama 3.1 8B) handles contextual spam and hate speech.
- **Owner notifications** — an email is sent to `carlos@ardila.com.co` whenever a comment is approved.
- **No cold starts** — Cloudflare Workers never pause (unlike Supabase free tier).

### Auth Flow

1. Visitor submits name + email → worker stores a one-time token (15 min TTL) in D1 and sends a magic link via Resend.
2. Visitor clicks the link → token is validated, user is upserted in D1, a signed JWT (30-day expiry) is returned.
3. JWT stored in `localStorage`; subsequent visits skip auth automatically.

### Worker setup (local, not tracked in GitHub)

The Cloudflare Worker lives in `comments-worker/` inside this repo. To deploy changes:

```bash
# Apply D1 migrations
npx wrangler d1 migrations apply blog-comments --remote --config comments-worker/wrangler.toml

# Deploy worker
npx wrangler deploy --config comments-worker/wrangler.toml

# Delete all comments (admin)
npx wrangler d1 execute blog-comments --remote --command "DELETE FROM comments;" --config comments-worker/wrangler.toml
```

Required secrets (set via `wrangler secret put`):
- `JWT_SECRET` — random string used to sign JWTs
- `RESEND_API_KEY` — from resend.com
- `BLOG_URL` — `https://blog.cardila.com`

### Environment variable for the build

`PUBLIC_COMMENTS_API` is baked in at build time via `.github/workflows/deploy.yml`. The component reads it with `import.meta.env.PUBLIC_COMMENTS_API`.

### D1 Schema

```sql
CREATE TABLE users        (id, email UNIQUE, name, created_at);
CREATE TABLE magic_tokens (id, email, name, token UNIQUE, expires_at, used);
CREATE TABLE comments     (id, post_slug, user_id, author_name, content,
                           status DEFAULT 'approved', moderation_note,
                           parent_id REFERENCES comments(id), created_at);
```

### Sending domain

Magic links and notifications are sent from `noreply@notificaciones.cardila.com` (verified subdomain in Resend to avoid conflicts with existing email on `cardila.com.co`).

---

## Image Lightbox & Optimization

This blog includes a custom vanilla JavaScript lightbox with automatic image optimization powered by Astro.

### Using the Lightbox

Add `{.lightbox}` after any image in markdown to enable lightbox functionality:

```markdown
![Alt text](/images/photo.jpg){.lightbox}
```

**Features:**
- Click image to view full-resolution in modal
- Keyboard navigation: `←` / `→` arrows, `ESC` to close, `Home` / `End`
- Gallery support: Navigate between multiple lightbox images
- Image counter showing position (e.g., "3 / 8")
- Loading spinner while images load
- Responsive design (mobile-friendly)
- Dark mode support
- Zero dependencies (vanilla JS)

**Optional custom caption:**
```markdown
![Alt text](/images/photo.jpg){.lightbox data-caption="Custom caption text"}
```

### Image Optimization

Astro automatically optimizes images based on their location:

#### Images from `src/assets/` (Optimized)
✅ **Recommended for new images**

```markdown
![My Image](../../assets/photo.jpg){.lightbox}
```

**Automatic optimizations:**
- Modern formats (WebP, AVIF)
- Multiple sizes for responsive images
- Lazy loading
- Reduced file size (typically 30-50% smaller)
- Dimensions detected automatically

**Result:** Fast-loading thumbnails + high-quality lightbox experience

#### Images from `public/images/` (Static)
📁 **Used for existing WordPress migrated content**

```markdown
![My Image](/images/posts/2025/photo.jpg){.lightbox}
```

**Behavior:**
- Served as-is without optimization
- Works normally but no automatic optimization
- Useful for legacy content

### Using Astro Image Components

For even more control, you can use Astro's `<Image />` and `<Picture />` components:

#### In .astro files
```astro
---
import { Image, Picture } from 'astro:assets';
import myImage from '../assets/photo.jpg';
---

<Image src={myImage} alt="Description" />
<Picture src={myImage} formats={['avif', 'webp']} alt="Description" />
```

#### In .mdx files
Convert your markdown file from `.md` to `.mdx` and import components:

```mdx
---
title: "My Post"
---
import { Image } from 'astro:assets';
import photo from '../../assets/photo.jpg';

<Image src={photo} alt="My photo" />
```

**Note:** Regular `.md` files cannot use components directly. Use `.mdx` extension for component support.

### Technical Details

**Architecture:**
- `src/plugins/remark-lightbox-syntax.ts` - Parses `{.lightbox}` syntax
- `src/plugins/rehype-lightbox.ts` - Processes attributes and adds lazy loading
- `src/components/Lightbox.astro` - Web Component with navigation
- `src/styles/blocks/lightbox.css` - Animations and dark mode styles

**Browser Support:** Modern browsers with HTML `<dialog>` API support (Chrome 37+, Firefox 98+, Safari 15.4+)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

- **Code**: All code in this repository is licensed under the [MIT License](LICENSE).
- **Content**: All written content (blog posts, articles, notes) is licensed under [CC BY-4.0](https://creativecommons.org/licenses/by/4.0/).

## Credits

- Theme: [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) by [@chrismwilliams](https://github.com/chrismwilliams)
- Built with [Astro](https://astro.build)

---

© 2025 Carlos Ardila. Code licensed under MIT, content under CC BY-4.0.
