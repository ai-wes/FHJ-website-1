"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  date: string;
  readingTime: string;
  author?: string;
}

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export function ArticleCard({
  id,
  title,
  excerpt,
  coverImage,
  category,
  date,
  readingTime,
  author,
}: ArticleCardProps) {
  const imageSrc =
    coverImage && isValidUrl(coverImage) ? coverImage : "/placeholder.svg";

  return (
    <Card className="tech-card overflow-hidden transition-all hover:shadow-md border-primary/10 bg-card/50 backdrop-blur-sm">
      <div className="h-36 sm:h-40 md:h-44 overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          width={400}
          height={180}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-3">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[11px] font-medium text-primary">
            {category}
          </span>
          <Separator orientation="vertical" className="h-3" />
          <span className="text-[11px] text-muted-foreground">{date}</span>
          {author && (
            <>
              <Separator orientation="vertical" className="h-3" />
              <span className="text-[11px] text-muted-foreground">
                By {author}
              </span>
            </>
          )}
        </div>
        <CardTitle className="line-clamp-2 text-base text-white drop-shadow-[0_1px_2px_rgba(255,255,255,0.08)]">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-xs mt-1">
          {excerpt}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-3 pt-0 flex items-center justify-between">
        <Button
          variant="ghost"
          className="p-0 text-primary hover:text-primary/80 group text-xs"
          asChild
        >
          <Link href={`/articles/${id}`}>
            Read Article{" "}
            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <span className="text-[11px] text-muted-foreground">{readingTime}</span>
      </CardFooter>
    </Card>
  );
}
