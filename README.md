# Carlos Ardila's Blog

This is the personal blog and website of **Carlos Ardila**, built with the [Astro Cactus Theme](https://github.com/chrismwilliams/astro-theme-cactus).

Visit the live site at: **[blog.cardila.com](https://blog.cardila.com)**

## About

This blog contains personal thoughts, movie reviews, technology articles, and various musings collected over the years. The site was migrated from WordPress to Astro in 2025 to take advantage of modern web technologies and improved performance.

## Tech Stack

- **Framework**: [Astro](https://astro.build) v5
- **Theme**: [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus)
- **Styling**: Tailwind CSS v4
- **Deployment**: GitHub Pages
- **Comments**: Giscus (GitHub Discussions)

## Key Features

- Fast static site generation with Astro
- Dark & Light mode
- Responsive design
- Static search with Pagefind
- Auto-generated OG images with Satori
- RSS feeds
- MDX support
- Custom reusable components (see below)

## Custom Components

This blog includes several custom Astro components designed for rich content:

- **MovieTrailerCard**: Display movie info with trailers from TMDB
- **MovieCard**: Display movie info from OMDB
- **BGGCard**: Display board game info from BoardGameGeek
- **Giscus**: GitHub Discussions-based comments

📖 **[See CUSTOM_COMPONENTS.md for detailed documentation and installation instructions](./CUSTOM_COMPONENTS.md)**

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
