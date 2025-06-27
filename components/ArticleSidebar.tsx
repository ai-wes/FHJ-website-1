"use client";

import { Search, Tag, User, Clock, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const popularTags = [
  "Neural Interfaces",
  "Brain-Computer Interface",
  "Neurotechnology",
  "Human Enhancement",
  "Longevity",
  "Aging",
  "Biotechnology",
  "Future of Medicine",
  "Consciousness",
  "Mind Uploading",
  "Digital Philosophy",
  "Transhumanism",
];

const topics = [
  "Technology",
  "Biotechnology",
  "Philosophy",
  "Society",
  "Environment",
  "Neuroscience",
];

interface ArticleSidebarProps {
  // For articles listing page
  search?: string;
  setSearch?: (v: string) => void;
  filterCategory?: string;
  setFilterCategory?: (v: string) => void;
  // For individual article pages
  article?: {
    author?: string;
    date: string;
    category?: string;
    reading_time?: string;
  };
  compact?: boolean;
}

export default function ArticleSidebar({
  search = "",
  setSearch,
  filterCategory = "",
  setFilterCategory,
  article,
  compact = true,
}: ArticleSidebarProps) {
  const cardStyle = {
    backdropFilter: "blur(23px) saturate(200%)",
    WebkitBackdropFilter: "blur(23px) saturate(200%)",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 193, 7, 0.05) 100%)",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  return (
    <aside className="space-y-4 sticky top-24">
      {/* Search - Only show when not on individual article page */}
      {!article && (
        <Card style={cardStyle}>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium text-white">Search Articles</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch?.(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300 text-xs"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter - Only show when not on individual article page */}
      {!article && (
        <Card style={cardStyle}>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium text-white">Filter by Category</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterCategory?.("")}
                className={`w-full justify-start text-xs ${
                  filterCategory === ""
                    ? "bg-yellow-400/20 text-yellow-300 border-yellow-400/50"
                    : "bg-white/10 text-gray-300 border-white/30 hover:bg-white/20"
                }`}
              >
                All Categories
              </Button>
              {topics.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterCategory?.(category)}
                  className={`w-full justify-start text-xs ${
                    filterCategory === category
                      ? "bg-yellow-400/20 text-yellow-300 border-yellow-400/50"
                      : "bg-white/10 text-gray-300 border-white/30 hover:bg-white/20"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Author Info - Only show on individual article pages */}
      {article && (
        <Card style={cardStyle}>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium text-white">About the Author</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-3 pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={article.author || "Author"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {article.author ? article.author.charAt(0).toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-sm text-white">{article.author || "Future Human Labs"}</h3>
                <p className="text-xs text-gray-300">Author</p>
              </div>
            </div>
            <p className="text-xs text-gray-300">
              Exploring the intersection of technology, humanity, and the future.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Article Info - Only show on individual article pages */}
      {article && (
        <Card style={cardStyle}>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium text-white">Article Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-3 pb-3">
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long", 
                day: "numeric",
              })}</span>
            </div>
            {article.reading_time && (
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <Clock className="h-4 w-4" />
                <span>{article.reading_time}</span>
              </div>
            )}
            {article.category && (
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <Tag className="h-4 w-4" />
                <Badge variant="outline" className="text-xs text-white border-white/30">
                  {article.category}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Popular Tags */}
      <Card style={cardStyle}>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-medium text-white">Popular Tags</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="flex flex-wrap gap-2">
            {popularTags.slice(0, 8).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer border-white/30 text-xs hover:border-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-300 text-gray-300 bg-white/5"
                onClick={() => !article && setFilterCategory?.(tag === filterCategory ? "" : tag)}
              >
                <Tag className="mr-1 h-2 w-2" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topics */}
      <Card style={cardStyle}>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-medium text-white">Explore Topics</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <div
                key={topic}
                className="cursor-pointer rounded px-2 py-1 text-xs transition-colors hover:bg-yellow-400/20 hover:text-yellow-300 text-gray-300 bg-white/5 border border-white/30"
                onClick={() => !article && setFilterCategory?.(topic === filterCategory ? "" : topic)}
              >
                {topic}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
