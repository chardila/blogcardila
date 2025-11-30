# MovieTrailerCard Component

An Astro component that displays movie information and embeds trailers from The Movie Database (TMDB) API with local caching support.

## Features

- 📽️ **Embedded YouTube trailers** directly in your blog posts
- 🎬 **Rich movie metadata** (title, release date, genres, rating, synopsis)
- 💾 **Local file-based caching** to avoid excessive API calls (24-hour TTL)
- 🌍 **Multi-language support** (Spanish with English fallback for trailers)
- 🎨 **Theme-aware styling** (supports light/dark mode)
- 🖼️ **Fallback images** (uses backdrop or poster if trailer unavailable)

## Setup

### 1. Get a TMDB API Key

1. Create an account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to Settings > API
3. Request an API key (choose "Developer" option)
4. Copy the **API Key (v3 auth)**

### 2. Add to Environment Variables

Add your API key to the `.env` file in the blog directory:

```bash
TMDB_API_KEY=your_tmdb_api_key_here
```

## Usage

### Basic Usage

Import and use the component in your MDX blog posts:

```mdx
---
title: "My Movie Review"
---

import MovieTrailerCard from '@/components/MovieTrailerCard.astro';

Check out this amazing movie!

<MovieTrailerCard movieId="550" />
```

### Finding Movie IDs

To find a TMDB movie ID:

1. Go to [themoviedb.org](https://www.themoviedb.org/)
2. Search for your movie
3. The ID is in the URL: `https://www.themoviedb.org/movie/550-fight-club` → ID is `550`

### Examples

**Fight Club**
```mdx
<MovieTrailerCard movieId="550" />
```

**The Shawshank Redemption**
```mdx
<MovieTrailerCard movieId="278" />
```

**Inception**
```mdx
<MovieTrailerCard movieId="27205" />
```

### Custom Styling

You can add custom CSS classes:

```mdx
<MovieTrailerCard movieId="550" class="rounded-lg shadow-xl" />
```

## What Gets Displayed

The component shows:

- **Trailer video** (YouTube embed) - if available
- **Backdrop image** - if no trailer
- **Poster image** - if no trailer or backdrop
- **Movie title** with release year
- **Original title** (if different from localized title)
- **Release date**
- **Runtime** (in minutes)
- **Genres**
- **TMDB rating** and vote count
- **Synopsis** (in Spanish when available)

## Caching

The component uses local file-based caching to prevent excessive API calls:

- **Cache location**: `.cache/` directory (gitignored)
- **Cache duration**: 24 hours
- **Cache key format**: `tmdb_movie_{movieId}`

### Cache Benefits

1. **Faster page builds** - Cached responses load instantly
2. **API rate limit protection** - Reduces API calls during development
3. **Offline development** - Once cached, works without internet

### Managing Cache

The cache is managed automatically, but you can clear it manually:

```bash
# Clear all cache
rm -rf .cache/

# Clear specific movie cache
rm .cache/tmdb_movie_550.json
```

## API Details

### TMDB API Endpoints Used

1. **Movie Details**: `/3/movie/{id}?language=es-ES`
   - Fetches movie metadata, poster, backdrop, etc.

2. **Videos**: `/3/movie/{id}/videos?language=es-ES`
   - Fetches trailers and teasers
   - Falls back to English (`en-US`) if no Spanish trailer exists

### API Response Handling

- Caches successful responses for 24 hours
- Returns error message if API key is missing
- Gracefully handles missing trailers (shows image instead)
- Displays loading state during fetch

## Troubleshooting

### "TMDB_API_KEY env var not found"

Make sure you've added the API key to your `.env` file and restarted the dev server.

### "No hay trailer disponible"

Some movies don't have trailers in TMDB. The component will display a poster/backdrop image instead.

### Rate Limiting

If you hit TMDB's rate limits (40 requests per 10 seconds):

1. Use the built-in caching (it's automatic!)
2. Avoid rebuilding frequently during development
3. The cache persists between builds

### Cache Not Working

Check that:
- The `.cache/` directory exists and is writable
- You're in the blog directory when running commands
- `.cache/` is in your `.gitignore` file

## Related Components

- **MovieCard.astro** - Displays movie info using OMDB API (no trailers)
- **BGGCard.astro** - Displays board game info using BGG API

## Technical Details

- **Framework**: Astro 5.16.1
- **API**: TMDB API v3
- **Cache**: File-based with 24h TTL
- **Languages**: Spanish (es-ES) with English (en-US) fallback
- **Video Platform**: YouTube embeds

## License

Part of the Astro Cactus theme project.
