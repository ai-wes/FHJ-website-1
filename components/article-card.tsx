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
    <Card className="tech-card overflow-hidden transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white via-slate-50 to-blue-50 border border-slate-200/50 backdrop-blur-sm hover:scale-[1.02]">
      <div className="h-24 sm:h-28 md:h-32 overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          width={400}
          height={180}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-2">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[10px] font-medium bg-slate-800 text-white px-1 py-0 rounded">
            {category}
          </span>
          <span className="text-[10px] text-slate-600">{date}</span>
        </div>
        <CardTitle className="line-clamp-2 text-sm text-slate-900 leading-tight">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs mt-1 text-slate-700 leading-tight">
          {excerpt}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-2 pt-0 flex items-center justify-between">
        <Button
          variant="ghost"
          className="p-0 text-slate-800 hover:text-slate-600 group text-xs h-auto"
          asChild
        >
          <Link href={`/articles/${id}`}>
            Read{" "}
            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <span className="text-[10px] text-slate-600">{readingTime}</span>
      </CardFooter>
    </Card>
  );
}
