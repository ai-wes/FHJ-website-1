import { Suspense } from "react";
import ArticlesClientPage from "./ArticlesClientPage";
import type { Article as NextArticleType } from "@/lib/mongodb";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getAllArticles(): Promise<NextArticleType[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles`, {
      next: { revalidate: 300, tags: ["articles"] }, // Revalidate every 5 minutes
      cache: "force-cache",
    });

    if (!res.ok) {
      console.error(
        "Failed to fetch all articles from Flask, status:",
        res.status
      );
      return [];
    }
    const responseData = await res.json();
    const flaskArticles = responseData.articles || [];
    return flaskArticles.map((flaskArticle: any) => ({
      ...flaskArticle,
      _id: flaskArticle.id,
    }));
  } catch (error) {
    console.error("Error fetching all articles from Flask:", error);
    // Return empty array if backend is not available during build
    return [];
  }
}

// Loading component for Suspense
function ArticlesLoading() {
  return (
    <div className="p-8 text-center text-muted-foreground">
      Loading articles...
    </div>
  );
}

// Server component for articles content
async function ArticlesContent() {
  try {
    const articles = await getAllArticles();

    return (
      <div className="container mx-auto px-4 py-6">
        <ArticlesClientPage initialArticles={articles} />
      </div>
    );
  } catch (error) {
    console.error("Error in ArticlesContent:", error);
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-muted-foreground">
          <p>Unable to load articles at this time.</p>
          <p className="text-sm mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }
}

// Main page component with proper SSG support
export default function ArticlesPage() {
  return (
    <Suspense fallback={<ArticlesLoading />}>
      <ArticlesContent />
    </Suspense>
  );
}

// Enable static generation with ISR
export const revalidate = 300; // Revalidate every 5 minutes

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "Articles | Future Human Labs",
    description:
      "Explore our latest articles on AI, technology, and innovation.",
    openGraph: {
      title: "Articles | Future Human Labs",
      description:
        "Explore our latest articles on AI, technology, and innovation.",
      type: "website",
    },
  };
}
