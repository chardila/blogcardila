# Deployment Guide

This guide explains how to deploy the blog with environment variables properly configured.

## Environment Variables

The blog uses several environment variables that need to be configured both locally and in your deployment environment.

### Local Development

All environment variables are stored in `.env` file (which is gitignored). Copy `.env.example` if provided, or ensure your `.env` file contains:

```bash
# Cloudflare Web Analytics Token
CLOUDFLARE_ANALYTICS_TOKEN=your_token_here

# OMDB API Key (for MovieCard component)
OMDB_API_KEY=your_key_here

# BGG Token (Board Game Geek API)
BGG_TOKEN=your_token_here

# TMDB API Key (for MovieTrailerCard component)
TMDB_API_KEY=your_key_here

# Webmentions (optional)
WEBMENTION_API_KEY=your_key_here
WEBMENTION_URL=your_url_here
WEBMENTION_PINGBACK=your_pingback_url_here
```

### Cloudflare Analytics Setup

1. **Get your Cloudflare Analytics token:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Analytics & Logs** > **Web Analytics**
   - Create a new site or select existing one
   - Copy the token from the JavaScript snippet

2. **Add to local `.env` file:**
   ```bash
   CLOUDFLARE_ANALYTICS_TOKEN=11d84a3c272e4432a12c9051ec914f70
   ```

**Note:** The Cloudflare Analytics token is a **public token** (marked as `context: "client", access: "public"` in Astro config). This means it will be visible in your site's HTML source code. This is by design and safe - Cloudflare Analytics tokens are meant to be public and only work for the domain they're registered to.

## Deployment Options

### Option 1: GitHub Pages (with GitHub Actions)

1. **Set up GitHub Secrets:**
   - Go to your repository on GitHub
   - Navigate to **Settings** > **Secrets and variables** > **Actions**
   - Click **New repository secret**
   - Add each environment variable:
     - Name: `CLOUDFLARE_ANALYTICS_TOKEN`
     - Value: Your token value
   - Repeat for other variables if needed

2. **Create GitHub Actions Workflow:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd blog
          npm ci

      - name: Build with environment variables
        env:
          CLOUDFLARE_ANALYTICS_TOKEN: ${{ secrets.CLOUDFLARE_ANALYTICS_TOKEN }}
          OMDB_API_KEY: ${{ secrets.OMDB_API_KEY }}
          BGG_TOKEN: ${{ secrets.BGG_TOKEN }}
          TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}
          WEBMENTION_API_KEY: ${{ secrets.WEBMENTION_API_KEY }}
          WEBMENTION_URL: ${{ secrets.WEBMENTION_URL }}
          WEBMENTION_PINGBACK: ${{ secrets.WEBMENTION_PINGBACK }}
        run: |
          cd blog
          npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./blog/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **Enable GitHub Pages:**
   - Go to **Settings** > **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save

### Option 2: Cloudflare Pages

1. **Via Cloudflare Dashboard:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages**
   - Click **Create application** > **Pages** > **Connect to Git**
   - Select your repository
   - Configure build settings:
     - Build command: `cd blog && npm run build`
     - Build output directory: `blog/dist`
     - Root directory: `/`

2. **Set Environment Variables in Cloudflare:**
   - In your Pages project, go to **Settings** > **Environment variables**
   - Add each variable for **Production** and **Preview** environments:
     - `CLOUDFLARE_ANALYTICS_TOKEN`
     - `OMDB_API_KEY`
     - `BGG_TOKEN`
     - `TMDB_API_KEY`
     - `WEBMENTION_API_KEY` (optional)
     - `WEBMENTION_URL` (optional)
     - `WEBMENTION_PINGBACK` (optional)

3. **Trigger Deployment:**
   - Push to your repository
   - Cloudflare Pages will automatically build and deploy

### Option 3: Netlify

1. **Connect Repository:**
   - Go to [Netlify](https://app.netlify.com/)
   - Click **Add new site** > **Import an existing project**
   - Select your repository
   - Configure build settings:
     - Base directory: `blog`
     - Build command: `npm run build`
     - Publish directory: `blog/dist`

2. **Set Environment Variables:**
   - In your site dashboard, go to **Site settings** > **Environment variables**
   - Click **Add a variable** and add each one:
     - `CLOUDFLARE_ANALYTICS_TOKEN`
     - `OMDB_API_KEY`
     - `BGG_TOKEN`
     - `TMDB_API_KEY`
     - `WEBMENTION_API_KEY` (optional)
     - `WEBMENTION_URL` (optional)
     - `WEBMENTION_PINGBACK` (optional)

3. **Deploy:**
   - Click **Deploy site**
   - Future pushes to your main branch will auto-deploy

### Option 4: Vercel

1. **Import Project:**
   - Go to [Vercel](https://vercel.com/)
   - Click **Add New** > **Project**
   - Import your repository
   - Configure settings:
     - Root Directory: `blog`
     - Build Command: `npm run build`
     - Output Directory: `dist`

2. **Set Environment Variables:**
   - In **Settings** > **Environment Variables**
   - Add each variable for **Production**, **Preview**, and **Development**:
     - `CLOUDFLARE_ANALYTICS_TOKEN`
     - `OMDB_API_KEY`
     - `BGG_TOKEN`
     - `TMDB_API_KEY`
     - `WEBMENTION_API_KEY` (optional)
     - `WEBMENTION_URL` (optional)
     - `WEBMENTION_PINGBACK` (optional)

3. **Deploy:**
   - Click **Deploy**
   - Future commits will auto-deploy

## Testing Your Deployment

After deployment:

1. **Check Analytics:**
   - Open your deployed site
   - Open browser DevTools > Network tab
   - Look for requests to `static.cloudflareinsights.com`
   - Go to Cloudflare Dashboard > Analytics & Logs > Web Analytics
   - You should see traffic data within 5-10 minutes

2. **Verify Environment Variables:**
   - View page source (Ctrl+U or Cmd+U)
   - Search for `cloudflareinsights.com`
   - You should see the script with your token

3. **Check Build Logs:**
   - Review deployment logs for any environment variable warnings
   - Astro will show warnings if required variables are missing

## Security Notes

- **Never commit `.env` files to Git** - they're already in `.gitignore`
- **Public vs Secret tokens:**
  - `CLOUDFLARE_ANALYTICS_TOKEN` is public (visible in HTML)
  - `OMDB_API_KEY`, `BGG_TOKEN`, `TMDB_API_KEY`, `WEBMENTION_API_KEY` are server-side secrets (not exposed in HTML)
- **Rotate tokens** if accidentally committed to version control
- Use different tokens for preview/staging and production if possible

## Troubleshooting

### Analytics not showing up

1. Verify the token is correct in your deployment environment
2. Check that the script is present in your page source
3. Wait 5-10 minutes for data to appear in Cloudflare dashboard
4. Ensure your domain is registered in Cloudflare Web Analytics

### Build failures

1. Check deployment logs for missing environment variables
2. Verify all variables are set in your deployment platform
3. Ensure `blog/` directory structure is correct
4. Test build locally: `cd blog && npm run build`

### Environment variables not working

1. Ensure variables are named exactly as in `astro.config.ts`
2. Rebuild and redeploy after adding variables
3. Check that variables are set for the correct environment (production vs preview)
4. For client-side variables, verify they're marked as `context: "client"` in config

## Need Help?

- [Astro Environment Variables Docs](https://docs.astro.build/en/guides/environment-variables/)
- [Cloudflare Analytics Docs](https://developers.cloudflare.com/analytics/web-analytics/)
- [GitHub Secrets Docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
