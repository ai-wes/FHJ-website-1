import { MetadataRoute } from "next";

async function getAllArticles() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${API_BASE_URL}/articles`, {
      next: { revalidate: 300 },
      cache: "force-cache",
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(
          "No articles endpoint found, returning empty array for sitemap."
        );
        return [];
      }
      console.error("Failed to fetch articles for sitemap");
      return [];
    }

    const responseData = await res.json();
    return responseData.articles || [];
  } catch (error) {
    console.error("Error fetching articles for sitemap:", error);
    // Return empty array if backend is not available during build
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://futurehumanjournal.com";

  try {
    const articles = await getAllArticles();

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/articles`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
    ];

    // Dynamic article pages
    const articlePages = articles.map((article: any) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.date || article.updated_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...articlePages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return just static pages if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/articles`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
    ];
  }
}
