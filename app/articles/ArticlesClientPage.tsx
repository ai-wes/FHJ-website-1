"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Article } from "@/lib/mongodb";
import ArticleSidebar from "@/components/ArticleSidebar";

interface ArticlesClientPageProps {
  initialArticles: Article[];
  search?: string;
  setSearch?: (v: string) => void;
  filterCategory?: string;
  setFilterCategory?: (v: string) => void;
}

export default function ArticlesClientPage({
  initialArticles,
  search: initialSearch = "",
  setSearch: parentSetSearch,
  filterCategory: initialFilterCategory = "",
  setFilterCategory: parentSetFilterCategory,
}: ArticlesClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for search and filtering
  const [search, setSearch] = useState(initialSearch);
  const [filterCategory, setFilterCategory] = useState(initialFilterCategory);

  // Sync with URL params
  useEffect(() => {
    const topicParam = searchParams.get("topic") || "";
    const categoryParam = searchParams.get("category") || "";

    setSearch(topicParam);
    setFilterCategory(categoryParam);
  }, [searchParams]);

  // Update URL when search or filter changes
  const updateURL = (newSearch: string, newCategory: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("topic", newSearch);
    if (newCategory) params.set("category", newCategory);

    const queryString = params.toString();
    const newURL = queryString ? `/articles?${queryString}` : "/articles";

    router.push(newURL, { scroll: false });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateURL(value, filterCategory);
  };

  const handleCategoryChange = (value: string) => {
    setFilterCategory(value);
    updateURL(search, value);
  };

  const filteredArticles = useMemo(() => {
    let articlesToFilter = initialArticles;

    if (filterCategory) {
      articlesToFilter = articlesToFilter.filter(
        (article) =>
          article.category?.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    if (search) {
      articlesToFilter = articlesToFilter.filter(
        (article) =>
          article.title.toLowerCase().includes(search.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(search.toLowerCase()) ||
          article.category?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return articlesToFilter;
  }, [initialArticles, search, filterCategory]);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-6 md:py-10 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 h-px w-[80%] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute bottom-0 right-0 h-px w-[60%] bg-gradient-to-l from-transparent via-primary/50 to-transparent" />
        </div>
        <div className="container px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-[2.5rem] leading-[1.1] font-[300] mb-3 font-['Inter'] uppercase tracking-[-0.02em] text-[#f1f5f9] drop-shadow-[0_0_4px_rgba(0,188,212,0.5)]">
              Articles
            </h1>
            <p className="text-sm  font-['Inter'] font-[400] drop-shadow-[0_0_4px_rgba(0,188,212,0.5)] text-[#f1f5f9] mb-3">
              Explore the latest insights on the future of humanity through
              technology, science, and philosophy.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-4 md:py-6 relative">
        <div className="container px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <ArticleSidebar
                search={search}
                setSearch={handleSearchChange}
                filterCategory={filterCategory}
                setFilterCategory={handleCategoryChange}
              />
            </aside>
            
            {/* Main Content */}
            <main className="lg:col-span-3 order-1 lg:order-2">
          {/* Results count */}
          <div className="text-xs text-muted-foreground mb-4">
            {filteredArticles.length} articles found
            {(search || filterCategory) && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-auto p-1 text-xs"
                onClick={() => {
                  setSearch("");
                  setFilterCategory("");
                  updateURL("", "");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Posts grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {initialArticles.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No articles found.
              </div>
            )}
            {filteredArticles.length > 0 &&
              filteredArticles.map((article: Article) => (
                <Card
                  key={article.slug || article._id}
                  className="p-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backdropFilter: "blur(23px) saturate(200%)",
                    WebkitBackdropFilter: "blur(23px) saturate(200%)",
                    background: "linear-gradient(135deg, rgba(234, 234, 234, 0.8) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(240, 248, 255, 0.7) 100%)",
                    borderRadius: "12px",
                    border: "1px solid rgba(209, 213, 219, 0.3)",
                  }}
                >
                  <div className="h-24 sm:h-28 md:h-32 overflow-hidden">
                    <Image
                      src={
                        article.cover_image &&
                        !article.cover_image.includes("%3C") &&
                        !article.cover_image.includes("<cloud_name>")
                          ? article.cover_image
                          : "/placeholder.svg"
                      }
                      alt={article.title}
                      width={400}
                      height={180}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-medium bg-slate-800 text-white px-1 py-0"
                      >
                        {article.category}
                      </Badge>
                      <span className="text-[10px] text-slate-600">
                        {new Date(article.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 text-sm text-slate-900 leading-tight">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs mt-1 text-slate-700 leading-tight">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-2 pt-0 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="p-0 text-slate-800 hover:text-slate-600 group text-xs h-auto"
                      asChild
                    >
                      <Link href={`/articles/${article.slug}`}>
                        Read{" "}
                        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    {article.reading_time && (
                      <span className="text-[10px] text-slate-600">
                        {article.reading_time}
                      </span>
                    )}
                  </CardFooter>
                </Card>
              ))}
            {initialArticles.length > 0 && filteredArticles.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No articles match your current filter.
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    setSearch("");
                    setFilterCategory("");
                    updateURL("", "");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
