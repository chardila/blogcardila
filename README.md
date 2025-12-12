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
- **Image lightbox with automatic optimization** (see below)
- Custom reusable components (see below)

## Custom Components

This blog includes several custom Astro components designed for rich content:

- **MovieTrailerCard**: Display movie info with trailers from TMDB
- **MovieCard**: Display movie info from OMDB
- **BGGCard**: Display board game info from BoardGameGeek
- **Giscus**: GitHub Discussions-based comments

📖 **[See CUSTOM_COMPONENTS.md for detailed documentation and installation instructions](./CUSTOM_COMPONENTS.md)**

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
