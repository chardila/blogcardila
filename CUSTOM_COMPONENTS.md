# Custom Astro Components

This blog includes several custom Astro components designed to enhance content with rich media cards. These components can be reused in other Astro projects.

## Components Overview

### 1. MovieTrailerCard.astro
Fetches and displays movie information with trailers from TMDB (The Movie Database).

**Features:**
- Auto-fetches movie data from TMDB API
- Displays movie poster, backdrop, or trailer (YouTube embed)
- Shows movie details: title, release date, runtime, genres, ratings
- Supports Spanish and English content
- Built-in caching to reduce API calls
- Gracefully handles unavailable videos with poster fallback

**Props:**
- `movieId` (required): TMDB movie ID (e.g., "550" for Fight Club)
- `poster` (optional): Custom poster URL to override TMDB poster
- `showPoster` (optional): Boolean to force showing poster instead of trailer (useful when video is unavailable)
- `class` (optional): Additional CSS classes

**Environment Variables:**
- `TMDB_API_KEY`: Your TMDB API key from https://www.themoviedb.org/settings/api

**Usage in MDX:**
```mdx
---
title: "My Movie Review"
---

import MovieTrailerCard from '@/components/MovieTrailerCard.astro';

<MovieTrailerCard movieId="550" />

<!-- When YouTube video is unavailable, force showing poster -->
<MovieTrailerCard movieId="82693" showPoster={true} />

<!-- Use custom poster image -->
<MovieTrailerCard movieId="550" poster="/images/custom-poster.jpg" />
```

**Dependencies:**
- Requires `src/utils/cache.ts` for caching functionality

---

### 2. MovieCard.astro
Fetches and displays movie information from OMDB (Open Movie Database).

**Features:**
- Auto-fetches movie data from OMDB API
- Displays movie poster and detailed information
- Shows director, writer, actors, country, ratings
- Alternative to MovieTrailerCard when you prefer OMDB data

**Props:**
- `imdbId` (required): IMDB ID (e.g., "tt0137523" for Fight Club)

**Environment Variables:**
- `OMDB_API_KEY`: Your OMDB API key from https://www.omdbapi.com/apikey.aspx

**Usage in MDX:**
```mdx
---
title: "Movie Review"
---

import MovieCard from '@/components/MovieCard.astro';

<MovieCard imdbId="tt0137523" />
```

---

### 3. BGGCard.astro
Fetches and displays board game information from BoardGameGeek (BGG).

**Features:**
- Auto-fetches game data from BGG XML API
- Displays game image and detailed information
- Shows player count, playtime, complexity, ratings
- Handles BGG's 202 queued responses with polling
- Parses XML without heavy dependencies

**Props:**
- `gameId` (required): BGG thing ID (e.g., "174430" for Gloomhaven)
- `class` (optional): Additional CSS classes

**Environment Variables:**
- `BGG_TOKEN`: Bearer token from your BGG app (optional but recommended to avoid rate limits)

**Usage in MDX:**
```mdx
---
title: "Board Game Review"
---

import BGGCard from '@/components/BGGCard.astro';

<BGGCard gameId="174430" />
```

---

### 4. Giscus.astro
Adds GitHub Discussions-based comments to blog posts.

**Features:**
- Uses GitHub Discussions for comment storage
- Automatically syncs with site's dark/light theme
- No external database needed
- Moderation through GitHub

**Props:**
None (configuration is hardcoded in the component)

**Configuration:**
Edit the component file to set your own:
- `data-repo`: Your GitHub repository (format: "username/repo")
- `data-repo-id`: Your repository ID
- `data-category`: GitHub Discussions category
- `data-category-id`: Category ID

**Usage:**
```astro
---
import Giscus from '@/components/Giscus.astro';
---

<article>
  <!-- Your content -->
</article>

<Giscus />
```

**Setup:**
1. Enable GitHub Discussions in your repository
2. Visit https://giscus.app to generate your configuration
3. Update the component with your repository details

---

## Installation in Another Project

### Prerequisites
- Astro project (v4 or v5)
- Node.js and npm/pnpm

### Step 1: Copy Component Files
Copy the desired component(s) from `src/components/` to your project's `src/components/` directory:
- `MovieTrailerCard.astro`
- `MovieCard.astro`
- `BGGCard.astro`
- `Giscus.astro`

### Step 2: Copy Utilities (if using MovieTrailerCard)
If using `MovieTrailerCard.astro`, also copy:
- `src/utils/cache.ts` (caching utility)

### Step 3: Set Environment Variables
Create or update your `.env` file:

```bash
# For MovieTrailerCard
TMDB_API_KEY=your_tmdb_api_key_here

# For MovieCard
OMDB_API_KEY=your_omdb_api_key_here

# For BGGCard (optional)
BGG_TOKEN=your_bgg_bearer_token_here
```

**Getting API Keys:**
- **TMDB**: Sign up at https://www.themoviedb.org, go to Settings → API, request API key
- **OMDB**: Get key at https://www.omdbapi.com/apikey.aspx (free tier available)
- **BGG**: Optional, but helps avoid rate limits. Create an app at BoardGameGeek.

### Step 4: Configure Giscus (if using)
1. Visit https://giscus.app
2. Enter your repository name
3. Choose discussion category
4. Copy the configuration values
5. Update `src/components/Giscus.astro` with your values

### Step 5: Use in Your Content
Import and use components in your `.mdx` files:

```mdx
---
title: "My Post"
---

import MovieTrailerCard from '@/components/MovieTrailerCard.astro';
import BGGCard from '@/components/BGGCard.astro';

<MovieTrailerCard movieId="550" />
<BGGCard gameId="174430" />
```

---

## Styling

All components use CSS custom properties for theming:
- `--theme-bg-offset`: Background color for cards
- `--color-accent`: Accent color
- `--color-link`: Link color
- Theme variables defined in your global CSS

Components are designed to work with Tailwind CSS but can be adapted to other CSS frameworks.

---

## API Rate Limits

**Be aware of API rate limits:**
- **TMDB**: 40 requests per 10 seconds
- **OMDB**: 1,000 requests/day (free tier)
- **BGG**: No official limit, but polling is built-in for queued responses

The `MovieTrailerCard` component includes caching to minimize API calls during builds.

---

## Contributing

These components were developed for this blog but are designed to be reusable. Feel free to:
- Copy and modify for your own projects
- Submit improvements via pull requests
- Report issues in the repository

---

## License

These custom components are licensed under MIT, same as the blog code.
