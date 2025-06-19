import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import type { Article as NextArticleType } from "@/lib/mongodb";
import ArticlePageSidebar from "@/components/ArticlePageSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, List } from "lucide-react";

// Helper function to properly decode HTML content and fix encoding issues
function decodeHtmlContent(content: string): string {
  try {
    // First, try to decode if it's URL encoded
    let decoded = content;
    
    // Check if content appears to be URL encoded
    if (content.includes('%') && content.includes('%3C')) {
      decoded = decodeURIComponent(content);
    }
    
    // Fix common UTF-8 encoding issues first
    decoded = decoded
      .replace(/â€™/g, "'")  // curly apostrophe
      .replace(/â€œ/g, '"')  // left double quote  
      .replace(/â€/g, '"')   // right double quote
      .replace(/â€"/g, '—')  // em dash
      .replace(/â€"/g, '–')  // en dash
      .replace(/they�re/g, "they're")
      .replace(/don�t/g, "don't")
      .replace(/can�t/g, "can't")
      .replace(/won�t/g, "won't")
      .replace(/it�s/g, "it's")
      .replace(/that�s/g, "that's")
      .replace(/�/g, "'");   // generic replacement for corrupted apostrophes
    
    // Decode HTML entities
    decoded = decoded
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–');
    
    return decoded;
  } catch (error) {
    console.error('Error decoding HTML content:', error);
    // If decoding fails, try basic HTML entity replacement and encoding fixes
    return content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/�/g, "'");
  }
}

// Helper function to parse and structure blog content for better display
function parseArticleContent(content: string) {
  const decoded = decodeHtmlContent(content);
  
  // Split content into sections based on common patterns
  const sections = [];
  const lines = decoded.split('\n\n');
  
  let currentSection = { type: 'intro', content: [] as string[] };
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Check if this line starts a new section
    if (trimmed.startsWith('##') || trimmed.startsWith('2024\'s Most Advanced') || 
        trimmed.startsWith('Integration, APIs') || trimmed.startsWith('Privacy and Regulatory') ||
        trimmed.startsWith('Digital Twins in Action') || trimmed.startsWith('FAQ:') ||
        trimmed.startsWith('Ready for Your Digital Twin')) {
      
      // Save previous section if it has content
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      
      // Determine section type
      let sectionType = 'content';
      if (trimmed.includes('FAQ')) sectionType = 'faq';
      else if (trimmed.includes('Ready for') || trimmed.includes('conclusion')) sectionType = 'conclusion';
      else if (trimmed.includes('ranking') || trimmed.includes('At-a-Glance')) sectionType = 'ranking';
      else if (trimmed.includes('Integration') || trimmed.includes('API')) sectionType = 'technical';
      else if (trimmed.includes('Privacy') || trimmed.includes('Regulatory')) sectionType = 'privacy';
      
      currentSection = { type: sectionType, content: [trimmed] };
    } else {
      currentSection.content.push(trimmed);
    }
  }
  
  // Add final section
  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }
  
  return sections;
}

// Component for rendering a content section
function ContentSection({ section, index }: { section: { type: string; content: string[] }; index: number }) {
  const getSectionStyles = (type: string) => {
    switch (type) {
      case 'intro':
        return 'bg-gradient-to-r from-primary/5 to-accent/5 border-l-4 border-primary p-6 rounded-r-lg';
      case 'ranking':
        return 'bg-muted/30 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20';
      case 'technical':
        return 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800';
      case 'privacy':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800';
      case 'faq':
        return 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800';
      case 'conclusion':
        return 'bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg border-2 border-primary/20';
      default:
        return 'p-4';
    }
  };

  return (
    <section id={`section-${index}`} className={`mb-8 ${getSectionStyles(section.type)}`} data-type={section.type}>
      {section.content.map((paragraph, pIndex) => {
        // Check if this is a heading
        if (paragraph.startsWith('##') || paragraph.includes('2024\'s Most Advanced') || 
            paragraph.includes('Integration, APIs') || paragraph.includes('Privacy and Regulatory') ||
            paragraph.includes('Digital Twins in Action') || paragraph.includes('FAQ:') ||
            paragraph.includes('Ready for Your Digital Twin')) {
          return (
            <h2 key={pIndex} className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              {paragraph.replace(/^##\s*/, '')}
            </h2>
          );
        }
        
        // Check if this is a list item
        if (paragraph.startsWith('- ')) {
          const listItems = section.content.filter(item => item.startsWith('- '));
          const listIndex = listItems.indexOf(paragraph);
          
          if (listIndex === 0) {
            return (
              <ul key={pIndex} className="space-y-3 ml-4">
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
                    <span className="text-foreground leading-relaxed">{item.substring(2)}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return null; // Skip individual list items as they're rendered in the ul above
        }
        
        // Check if this is a question in FAQ
        if (paragraph.startsWith('Q:')) {
          return (
            <div key={pIndex} className="mb-4">
              <h3 className="font-semibold text-lg mb-2 text-primary">{paragraph}</h3>
            </div>
          );
        }
        
        // Check if this is an answer in FAQ
        if (paragraph.startsWith('A:')) {
          return (
            <p key={pIndex} className="text-muted-foreground mb-4 pl-4 border-l-2 border-primary/20 leading-relaxed">
              {paragraph.substring(2).trim()}
            </p>
          );
        }
        
        // Regular paragraph
        return (
          <p key={pIndex} className="text-foreground leading-relaxed mb-4 text-base">
            {paragraph}
          </p>
        );
      })}
    </section>
  );
}

// Table of Contents component
function TableOfContents({ sections }: { sections: { type: string; content: string[] }[] }) {
  const getTocItems = () => {
    return sections.map((section, index) => {
      const firstContent = section.content[0];
      if (firstContent && (firstContent.startsWith('##') || firstContent.includes('2024\'s Most Advanced') || 
          firstContent.includes('Integration, APIs') || firstContent.includes('Privacy and Regulatory') ||
          firstContent.includes('Digital Twins in Action') || firstContent.includes('FAQ:') ||
          firstContent.includes('Ready for Your Digital Twin'))) {
        return {
          id: `section-${index}`,
          title: firstContent.replace(/^##\s*/, ''),
          type: section.type
        };
      }
      return null;
    }).filter(Boolean);
  };

  const tocItems = getTocItems();

  if (tocItems.length === 0) return null;

  return (
    <div className="mb-8 p-6 bg-muted/20 rounded-lg border border-muted-foreground/20">
      <div className="flex items-center space-x-2 mb-4">
        <List className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Table of Contents</h2>
      </div>
      <nav className="space-y-2">
        {tocItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 pl-2 border-l-2 border-transparent hover:border-primary"
          >
            {item.title}
          </a>
        ))}
      </nav>
    </div>
  );
}

async function getArticle(slug: string): Promise<NextArticleType | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      cache: "force-cache",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error(
        `Failed to fetch article ${slug} from Flask, status:`,
        res.status
      );
      return null;
    }
    const responseData = await res.json();
    const flaskArticle = responseData.article || responseData;
    if (!flaskArticle) return null;

    // Construct the full audio URL if audio_url exists
    const audioUrl = flaskArticle.audio_url
      ? `${API_BASE_URL}${flaskArticle.audio_url}`
      : undefined;

    return {
      ...flaskArticle,
      _id: flaskArticle.id,
      image: flaskArticle.cover_image,
      audio_url: audioUrl, // Use the fully constructed URL
    };
  } catch (error) {
    console.error(`Error fetching article ${slug} from Flask:`, error);
    return null;
  }
}

async function getAllArticleSlugs(): Promise<string[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${API_BASE_URL}/articles`, {
      next: { revalidate: 300 },
      cache: "force-cache",
    });

    if (!res.ok) {
      // If the endpoint is not found, treat it as no articles
      if (res.status === 404) {
        console.warn(
          "No articles endpoint found, returning empty array for static generation."
        );
        return [];
      }
      console.error("Failed to fetch articles for static generation");
      return [];
    }

    const responseData = await res.json();
    const articles = responseData.articles || [];
    return articles.map((article: any) => article.slug).filter(Boolean);
  } catch (error) {
    console.error("Error fetching articles for static generation:", error);
    // Return empty array if backend is not available during build
    return [];
  }
}

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Generate static params for SSG
export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs();

    // If no slugs are available (backend down), return empty array
    // This allows the build to continue and pages will be generated on-demand
    return slugs.map((slug) => ({
      slug: slug,
    }));
  } catch (error) {
    console.warn(
      "Could not generate static params, falling back to on-demand generation:",
      error
    );
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
      return {
        title: "Article Not Found | Future Human Labs",
        description: "The requested article could not be found.",
      };
    }

    return {
      title: `${article.title} | Future Human Labs`,
      description:
        article.excerpt || `Read ${article.title} on Future Human Labs`,
      openGraph: {
        title: article.title,
        description:
          article.excerpt || `Read ${article.title} on Future Human Labs`,
        type: "article",
        publishedTime: article.date,
        authors: article.author ? [article.author] : undefined,
        images: article.image
          ? [
              {
                url: article.image,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description:
          article.excerpt || `Read ${article.title} on Future Human Labs`,
        images: article.image ? [article.image] : undefined,
      },
      keywords: article.category ? [article.category] : undefined,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Article | Future Human Labs",
      description: "Read the latest articles on Future Human Labs",
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: article.author || "Future Human Labs",
    },
    publisher: {
      "@type": "Organization",
      name: "Future Human Labs",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://futurehumanjournal.com/articles/${article.slug}`,
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <ArticlePageSidebar article={article} />
          </aside>
          
          {/* Main Content */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            <article className="max-w-4xl">
              {/* Article Header */}
              <header className="mb-8">
                <div className="mb-6">
                  {article.category && (
                    <Badge variant="secondary" className="mb-4">
                      {article.category}
                    </Badge>
                  )}
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                    {article.title}
                  </h1>
                </div>

                {/* Author and Meta Info */}
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-border">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={article.author || "Author"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {article.author ? article.author.charAt(0).toUpperCase() : "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{article.author || "Future Human Labs"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(article.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {article.reading_time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{article.reading_time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {article.image &&
                !article.image.includes("%3C") &&
                !article.image.includes("<cloud_name>") && (
                  <div className="mb-8 relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                    />
                  </div>
                )}

              {/* Audio Player */}
              {article.audio_url && (
                <div className="mb-8 p-4 bg-muted/50 rounded-lg">
                  <audio controls className="w-full" src={article.audio_url}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Article Content */}
              {article.content && (
                <div className="article-content">
                  {/* Table of Contents */}
                  <TableOfContents sections={parseArticleContent(article.content)} />
                  
                  {/* Parsed Content Sections */}
                  {parseArticleContent(article.content).map((section, index) => (
                    <ContentSection key={index} section={section} index={index} />
                  ))}
                </div>
              )}

              {!article.content && (
                <p className="text-center text-muted-foreground py-8">
                  Article content is not available.
                </p>
              )}
            </article>
          </main>

        </div>
      </div>
    </>
  );
}

// Enable static generation with ISR
export const revalidate = 300; // Revalidate every 5 minutes

// Enable dynamic rendering for pages not statically generated
export const dynamicParams = true;
