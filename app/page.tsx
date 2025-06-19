"use client";

import React from "react";
import { SpanizeText } from "../components/SpanizeText";
import { useInView } from "../components/useInView";
import { SectionWithInViewAnimation } from "./SectionWithInViewAnimation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Brain,
  Dna,
  Zap,
  Network,
  Cpu,
  Microscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { HeroSection } from "@/components/hero-section";
import { RecentArticles } from "@/components/recent-articles";
import type { Article as NextArticleType } from "@/lib/mongodb";

// Define a type for the article structure coming from Flask
interface FlaskArticle {
  id: string; // from str(_id)
  title: string;
  excerpt: string;
  content: string;
  cover_image?: string; // Flask uses cover_image
  category?: string;
  topics?: string[];
  tags?: string[];
  author?: string;
  author_image?: string;
  date: string; // Assuming this is an ISO date string
  reading_time?: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

async function getFeaturedArticles(
  limit: number = 3
): Promise<NextArticleType[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${API_BASE_URL}/articles?limit=${limit}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(
        "Failed to fetch featured articles from Flask, status:",
        res.status
      );
      return [];
    }
    const responseData = await res.json(); // Flask returns { total: ..., articles: [...] }
    const flaskArticles: FlaskArticle[] = responseData.articles || [];

    // Adapt FlaskArticle to NextArticleType
    return flaskArticles.map((flaskArticle) => ({
      ...flaskArticle,
      _id: flaskArticle.id, // Map id to _id
      image: flaskArticle.cover_image, // Map cover_image to image
      // Ensure other fields align or add more mappings if needed
    }));
  } catch (error) {
    console.error("Error fetching featured articles from Flask:", error);
    return [];
  }
}

export default function Home() {
  const [featuredArticles, setFeaturedArticles] = React.useState<
    NextArticleType[]
  >([]);

  React.useEffect(() => {
    getFeaturedArticles().then(setFeaturedArticles);
  }, []);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <RecentArticles />

      <section className="py-12 md:py-16 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 h-px w-[40%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute bottom-0 right-0 h-px w-[30%] bg-gradient-to-l from-transparent via-primary/30 to-transparent" />
          <div className="absolute top-[20%] right-[15%] h-[2px] w-[40px] bg-accent-secondary/40" />
          <div className="absolute bottom-[30%] left-[20%] h-[2px] w-[30px] bg-accent-secondary/30" />
        </div>
        <div className="container px-8">
          <div className="mx-auto max-w-2xl rounded-lg border border-primary/20 bg-white/90 dark:bg-white/10 p-8 backdrop-blur-sm shadow-[0_8px_30px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-1 bg-accent-secondary/60"></div>

            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold font-inter tracking-tight mb-2">
                Be an Informed{" "}
                <span className="bg-gradient-to-r from-accent-secondary to-accent-secondary/70 bg-clip-text text-transparent">
                  Future
                </span>{" "}
                Human
              </h2>
              <p className="text-sm font-inter text-muted-foreground">
                Curated enlightenment. Straight to your inbox. Sign up below.
              </p>
            </div>
            <NewsletterSignup />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 relative data-flow">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-px w-[40%] bg-gradient-to-l from-transparent via-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 h-px w-[30%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
        <div className="container px-8">
          <div className="mb-16 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Featured
              </span>{" "}
              Dispatches
            </h2>
            <Link
              href="/articles"
              className="flex items-center text-primary hover:text-primary/80 group text-sm"
            >
              View All{" "}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mb-8 -mt-8 text-center md:text-left">
            Rapid-fire analyses on the breakthroughs that actually matter.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredArticles && featuredArticles.length > 0 ? (
              featuredArticles.map((article, index) => (
                <Card
                  key={article.slug || article._id}
                  className={`tech-card overflow-hidden transition-all hover:shadow-lg border-primary/10 
                  bg-white/90 dark:bg-white/10
                  backdrop-blur-sm shadow-[0_8px_30px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]
                  hover:translate-y-[-2px] duration-300 ${
                    index === 0 && featuredArticles.length >= 3
                      ? "sm:col-span-2 lg:col-span-1 lg:row-span-2"
                      : ""
                  }`}
                >
                  <div
                    className={`aspect-video overflow-hidden ${
                      index === 0 && featuredArticles.length >= 3
                        ? "lg:aspect-[9/16]"
                        : ""
                    }`}
                  >
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={600}
                      height={340}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-5 relative">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-primary">
                        {article.category}
                      </span>
                      <Separator orientation="vertical" className="h-3" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(article.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {article.author && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <span className="text-xs text-muted-foreground">
                            By {article.author}
                          </span>
                        </>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-sm mt-2">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-5 pt-0">
                    <Button
                      variant="ghost"
                      className="p-0 text-primary hover:text-primary/80 group text-sm"
                      asChild
                    >
                      <Link href={`/articles/${article.slug}`}>
                        Read Article{" "}
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                Featured articles are currently unavailable.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Remove the original newsletter section at the bottom since we've added it after the hero */}
    </div>
  );
}

function TopicCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="tech-card bg-white/90 dark:bg-white/10 backdrop-blur-sm border-primary/10 overflow-hidden group shadow-[0_8px_30px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] hover:translate-y-[-2px] duration-300">
      <CardHeader className="flex flex-row items-start gap-4 p-6 relative">
        {/* Subtle gradient overlay at the top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        <div className="mt-1 p-2 rounded-md bg-primary/5 border border-primary/10 transition-colors group-hover:bg-primary/10">
          {icon}
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-3 text-sm">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-2">
        <Button
          variant="ghost"
          className="p-0 text-primary hover:text-primary/80 group text-sm"
          asChild
        >
          <Link href={href}>
            Explore Topic{" "}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        {/* Add a small yellow accent dot */}
        {title === "Artificial Intelligence" && (
          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-secondary"></div>
        )}
      </CardFooter>
    </Card>
  );
}
