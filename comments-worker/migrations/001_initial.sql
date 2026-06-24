CREATE TABLE users (
  id         TEXT PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE magic_tokens (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL,
  name       TEXT NOT NULL,
  token      TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  used       INTEGER DEFAULT 0
);

CREATE TABLE comments (
  id              TEXT PRIMARY KEY,
  post_slug       TEXT NOT NULL,
  user_id         TEXT NOT NULL REFERENCES users(id),
  author_name     TEXT NOT NULL,
  content         TEXT NOT NULL,
  status          TEXT DEFAULT 'approved',
  moderation_note TEXT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_slug ON comments(post_slug, status, created_at);
