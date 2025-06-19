# Admin Dashboard Documentation

## Overview

The admin dashboard provides a comprehensive content management system for publishing and managing articles on the FHJ website. It includes rich text editing, research intelligence, and analytics features.

## Features

### 📝 Article Management

- **Create New Articles**: Rich text editor with WYSIWYG capabilities
- **Edit Existing Articles**: In-place editing with live preview
- **Publish/Draft System**: Save as draft or publish immediately
- **Article Metadata**: Title, author, category, tags, featured image
- **SEO Optimization**: Automatic slug generation and reading time estimation

### 🔍 Research Intelligence

- **Topic Research**: AI-powered research using Perplexity API
- **Source Aggregation**: Collect sources from multiple outlets
- **Content Insights**: Generate summaries and insights for article creation
- **System Status**: Monitor backend service availability

### 📊 Analytics

- **Content Statistics**: Total articles, published count, featured articles
- **Performance Metrics**: Track article engagement (future enhancement)

## Access

Navigate to `/admin` to access the dashboard.

## Components

### Rich Text Editor

- **Toolbar Features**:

  - Text formatting (bold, italic, underline)
  - Headings (H1, H2, H3)
  - Lists (bullet and numbered)
  - Alignment (left, center, right)
  - Links and images
  - Code blocks and quotes
  - Live preview mode

- **Keyboard Shortcuts**:
  - `Ctrl+B`: Bold
  - `Ctrl+I`: Italic
  - `Ctrl+U`: Underline

### Article Form Fields

- **Title**: Article headline
- **Author**: Content creator name
- **Category**: Technology, Biotechnology, Philosophy, Society, Environment, Neuroscience
- **Date**: Publication date
- **Excerpt**: Brief description for article previews
- **Featured Image**: URL to article cover image
- **Content**: Rich text article body
- **Tags**: Comma-separated keywords
- **Featured**: Mark as featured article

### Research Intelligence

- **Research Queries**: Enter topics to research
- **AI Models**: Choose between Sonar Pro and Sonar
- **Source Collection**: Automatic source aggregation
- **Content Integration**: Copy research insights to article creation

## Backend Integration

### Flask API Endpoints

- `GET /articles` - Fetch all articles
- `POST /articles` - Create new article
- `PUT /articles/{id}` - Update existing article
- `DELETE /articles/{id}` - Delete article
- `POST /api/research-topic` - Research topic
- `GET /api/system-status` - Check system status
- `GET /api/research-status` - Check research service status

### Article Data Structure

```typescript
interface Article {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author?: string;
  date: string;
  image?: string;
  reading_time?: string;
  status: "draft" | "published" | "archived";
  featured?: boolean;
  tags?: string[];
}
```

## Usage Workflow

### Creating a New Article

1. Navigate to Admin Dashboard
2. Fill in article metadata (title, author, category, etc.)
3. Use the rich text editor to write content
4. Add tags and featured image
5. Choose to save as draft or publish immediately
6. Article automatically generates slug and reading time

### Using Research Intelligence

1. Go to Research Intelligence tab
2. Enter research topic
3. Select AI model (Sonar Pro recommended)
4. Review research results and sources
5. Copy insights to use in article creation

### Editing Existing Articles

1. Find article in the articles list
2. Click edit button
3. Modify content using rich text editor
4. Save changes or publish if draft

## Technical Features

### SEO Optimization

- Automatic slug generation from title
- Reading time estimation
- Meta descriptions from excerpts
- Structured data support

### Error Handling

- Graceful backend unavailability handling
- User-friendly error messages
- Retry mechanisms for failed requests

### Responsive Design

- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly controls

## Future Enhancements

### Planned Features

- **Image Upload**: Direct image upload to cloud storage
- **Auto-save**: Periodic saving of draft content
- **Version History**: Track article revisions
- **Collaboration**: Multi-user editing capabilities
- **Advanced Analytics**: Detailed performance metrics
- **Content Scheduling**: Schedule articles for future publication
- **SEO Analysis**: Built-in SEO recommendations
- **Content Templates**: Pre-defined article templates

### Integration Opportunities

- **AI Writing Assistant**: Enhanced content generation
- **Social Media Integration**: Auto-posting to social platforms
- **Email Newsletter**: Automatic newsletter generation
- **Content Calendar**: Editorial calendar management

## Troubleshooting

### Common Issues

**Flask Backend Not Available**

- Ensure Flask server is running on `http://localhost:5000`
- Check network connectivity
- Verify API endpoints are accessible

**Rich Text Editor Issues**

- Refresh the page if editor becomes unresponsive
- Use browser developer tools to check for JavaScript errors
- Ensure modern browser with contentEditable support

**Research Service Unavailable**

- Check Perplexity API configuration
- Verify API keys are properly set
- Monitor system status in the dashboard

## Security Considerations

- Admin dashboard should be protected with authentication
- Validate all user inputs on the backend
- Sanitize HTML content to prevent XSS attacks
- Implement rate limiting for API endpoints
- Use HTTPS in production environments

## Development

### Local Setup

1. Ensure Flask backend is running
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Navigate to `http://localhost:3000/admin`

### Building for Production

```bash
npm run build
npm start
```

The admin dashboard is designed to be intuitive and powerful, providing content creators with all the tools needed to produce high-quality articles efficiently.
