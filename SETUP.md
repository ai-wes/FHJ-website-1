# Future Human Labs - SSG/SSR Blog Setup

This Next.js application has been converted to support Server-Side Generation (SSG) and Server-Side Rendering (SSR) for optimal SEO and performance.

## Features

- ✅ **Static Site Generation (SSG)** with Incremental Static Regeneration (ISR)
- ✅ **Server-Side Rendering (SSR)** for dynamic content
- ✅ **SEO Optimization** with metadata, Open Graph, and Twitter Cards
- ✅ **Structured Data** for search engines
- ✅ **RSS Feed** generation
- ✅ **Sitemap** generation
- ✅ **Typography** styling for article content
- ✅ **Image optimization** with Next.js Image component
- ✅ **Caching strategies** for performance

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Flask Backend Configuration
FLASK_BACKEND_URL=http://localhost:5000

# Site Configuration
NEXT_PUBLIC_BASE_URL=https://futurehuman.labs

# SEO Configuration (optional)
GOOGLE_SITE_VERIFICATION=your_google_verification_code

# MongoDB Configuration (if using direct MongoDB connection)
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=futurehuman

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Installation

1. Install dependencies:

```bash
yarn install
```

2. Install the typography plugin:

```bash
yarn add -D @tailwindcss/typography
```

3. Start the development server:

```bash
yarn dev
```

## Build and Deploy

1. Build the application:

```bash
yarn build
```

2. Start the production server:

```bash
yarn start
```

## Key Changes Made

### 1. Articles Page (`app/articles/page.tsx`)

- Converted from client component to server component
- Added SSG with ISR (revalidates every 5 minutes)
- Added proper metadata generation
- Implemented Suspense for loading states

### 2. Individual Article Pages (`app/articles/[slug]/page.tsx`)

- Converted to server component with SSG
- Added `generateStaticParams` for static generation
- Added `generateMetadata` for dynamic SEO
- Added structured data for search engines
- Implemented proper error handling with `notFound()`

### 3. SEO Enhancements

- **Sitemap**: Auto-generated at `/sitemap.xml`
- **RSS Feed**: Available at `/feed.xml`
- **Robots.txt**: Generated at `/robots.txt`
- **Metadata**: Comprehensive meta tags for all pages
- **Structured Data**: JSON-LD for articles and organization

### 4. Performance Optimizations

- **Image Optimization**: Configured remote patterns for Flask backend
- **Caching**: Implemented proper cache headers
- **Compression**: Enabled gzip compression
- **Bundle Optimization**: Package import optimization

### 5. Typography

- Added `@tailwindcss/typography` plugin
- Custom typography styles for dark/light themes
- Proper article content styling

## API Endpoints

The application expects the following Flask backend endpoints:

- `GET /articles` - Returns list of all articles
- `GET /articles/{slug}` - Returns individual article by slug

### Expected Article Data Structure

```typescript
interface Article {
  _id?: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image?: string;
  category?: string;
  author?: string;
  reading_time?: string;
}
```

## Caching Strategy

- **Articles List**: Cached for 5 minutes with ISR
- **Individual Articles**: Statically generated with 5-minute revalidation
- **Images**: Optimized and cached by Next.js
- **Static Assets**: Long-term caching with proper headers

## SEO Features

### Metadata

- Dynamic page titles and descriptions
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs

### Structured Data

- Article schema for individual posts
- Organization schema for the site
- Breadcrumb navigation (can be added)

### Performance

- Core Web Vitals optimization
- Image optimization with proper sizing
- Lazy loading for images
- Efficient bundle splitting

## Development Notes

1. **Flask Backend**: Ensure your Flask backend is running on the configured URL
2. **Images**: Update image domains in `next.config.mjs` if using external image sources
3. **Styling**: Article content uses Tailwind Typography plugin for consistent styling
4. **Search**: Client-side search and filtering with URL synchronization

## Deployment Considerations

1. **Environment Variables**: Set all required environment variables in production
2. **Build Output**: The app is configured for standalone output for containerization
3. **CDN**: Consider using a CDN for static assets and images
4. **Monitoring**: Add performance monitoring for Core Web Vitals

## Future Enhancements

- [ ] Add breadcrumb navigation
- [ ] Implement article comments
- [ ] Add related articles suggestions
- [ ] Implement full-text search with search engine
- [ ] Add article reading progress indicator
- [ ] Implement article sharing functionality
