"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "./article-card";
import type { Article } from "@/lib/mongodb";

async function getRecentArticles(limit: number = 4): Promise<Article[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(
      `${API_BASE_URL}/articles?limit=${limit}&sort_by=date&sort_order=desc`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!res.ok) {
      console.error(
        "Failed to fetch recent articles from Flask, status:",
        res.status
      );
      return [];
    }
    const responseData = await res.json();
    const articles: Article[] = responseData.articles || [];

    return articles.map((article: any) => ({
      ...article,
      _id: article.id,
      cover_image: article.cover_image,
      author: article.author,
    }));
  } catch (error) {
    console.error("Error fetching recent articles from Flask:", error);
    return [];
  }
}

export function RecentArticles() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getRecentArticles()
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 md:py-32 relative data-flow">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-px w-[40%] bg-gradient-to-l from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-[30%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
      <div className="container px-8">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Latest
            </span>{" "}
            Updates
          </h2>
          <Link
            href="/articles"
            className="flex items-center text-primary hover:text-primary/80 group text-sm"
          >
            View All{" "}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-muted/30 animate-pulse rounded-lg h-64"
              />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                coverImage={article.cover_image || ""}
                category={article.category || "General"}
                date={new Date(article.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                readingTime={`${article.reading_time} min read`}
                author={article.author}
              />
            ))}
          </div>
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No recent articles found.
          </p>
        )}
      </div>
    </section>
  );
}
