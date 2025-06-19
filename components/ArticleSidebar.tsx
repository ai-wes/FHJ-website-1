"use client";

import { Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

export default function ArticleSidebar({
  search,
  setSearch,
  filterCategory,
  setFilterCategory,
  compact = true,
}: {
  search: string;
  setSearch: (v: string) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  compact?: boolean;
}) {
  // Compact mode: smaller paddings, font, and gaps
  const sectionClass =
    "rounded-lg border border-primary/10 bg-white/10 dark:bg-white/5 p-3 mb-3 shadow-sm";
  const headingClass = "text-base font-medium mb-2";
  const badgeClass =
    "cursor-pointer border-primary/20 text-xs py-0.5 px-2 hover:border-primary hover:bg-primary/10 hover:text-primary text-muted-foreground";
  const buttonClass =
    "w-full justify-start px-2 py-1 text-xs transition-colors";

  return (
    <aside className="space-y-2 sticky top-24">
      {/* Search */}
      <div className={sectionClass}>
        <h2 className={headingClass}>Search</h2>
        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-8 py-1 h-8 border-primary/20 focus-visible:ring-primary bg-background/50 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
      </div>
      {/* Popular Tags */}
      <div className={sectionClass}>
        <h2 className={headingClass}>Tags</h2>
        <div className="flex flex-wrap gap-1">
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant={filterCategory === tag ? "default" : "outline"}
              className={badgeClass}
              onClick={() =>
                setFilterCategory((current) => (current === tag ? "" : tag))
              }
            >
              <Tag className="mr-1 h-2 w-2" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      {/* Topics */}
      <div className={sectionClass}>
        <h2 className={headingClass}>Topics</h2>
        <ul className="space-y-1">
          {topics.map((topic) => (
            <li key={topic}>
              <Button
                variant={filterCategory === topic ? "secondary" : "ghost"}
                className={buttonClass}
                onClick={() =>
                  setFilterCategory((current) =>
                    current === topic ? "" : topic
                  )
                }
              >
                {topic}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
