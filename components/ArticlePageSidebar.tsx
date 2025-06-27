"use client";

import { Tag, User, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface ArticlePageSidebarProps {
  article: {
    author?: string;
    date: string;
    category?: string;
    reading_time?: string;
  };
}

export default function ArticlePageSidebar({ article }: ArticlePageSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Author Info */}
      <Card className="border-white/30 bg-white/70 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-black">About the Author</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" alt={article.author || "Author"} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {article.author ? article.author.charAt(0).toUpperCase() : "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm text-black">{article.author || "Future Human Labs"}</h3>
              <p className="text-xs text-gray-600">Author</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Exploring the intersection of technology, humanity, and the future.
          </p>
        </CardContent>
      </Card>

      {/* Article Info */}
      <Card className="border-white/30 bg-white/70 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-black">Article Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long", 
              day: "numeric",
            })}</span>
          </div>
          {article.reading_time && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{article.reading_time}</span>
            </div>
          )}
          {article.category && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Tag className="h-4 w-4" />
              <Badge variant="outline" className="text-xs text-black">
                {article.category}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card className="border-white/30 bg-white/70 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-black">Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.slice(0, 8).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer border-gray-300 text-xs hover:border-primary hover:bg-primary/10 hover:text-primary text-gray-700"
              >
                <Tag className="mr-1 h-2 w-2" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topics */}
      <Card className="border-white/30 bg-white/70 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-black">Explore Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topics.map((topic) => (
              <div
                key={topic}
                className="cursor-pointer rounded-md px-3 py-2 text-xs transition-colors hover:bg-primary/10 hover:text-primary text-gray-700"
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