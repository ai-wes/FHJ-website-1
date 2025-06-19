import { NextResponse } from "next/server";

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
          "No articles endpoint found, returning empty array for RSS feed."
        );
        return [];
      }
      console.error("Failed to fetch articles for RSS feed");
      return [];
    }

    const responseData = await res.json();
    return responseData.articles || [];
  } catch (error) {
    console.error("Error fetching articles for RSS feed:", error);
    // Return empty array if backend is not available
    return [];
  }
}

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://futurehumanjournal.com";

  try {
    const articles = await getAllArticles();

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Future Human Journal - Articles</title>
    <description>Explore the latest insights on the future of humanity through technology, science, and philosophy.</description>
    <link>${baseUrl}</link>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${articles
      .slice(0, 20) // Limit to 20 most recent articles
      .map(
        (article: any) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt || ""}]]></description>
      <link>${baseUrl}/articles/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/articles/${article.slug}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      ${
        article.category
          ? `<category><![CDATA[${article.category}]]></category>`
          : ""
      }
      ${article.author ? `<author><![CDATA[${article.author}]]></author>` : ""}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);

    // Return a basic RSS feed if there's an error
    const basicRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Future Human Journal - Articles</title>
    <description>Explore the latest insights on the future of humanity through technology, science, and philosophy.</description>
    <link>${baseUrl}</link>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
  </channel>
</rss>`;

    return new NextResponse(basicRssXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  }
}
