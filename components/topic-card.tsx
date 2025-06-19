"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface TopicCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}

export function TopicCard({ icon, title, description, href }: TopicCardProps) {
  return (
    <Card className="tech-card bg-background/50 backdrop-blur-sm border-primary/10 overflow-hidden group">
      <CardHeader className="flex flex-row items-start gap-4 p-6">
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
        {title === "Artificial Intelligence" && (
          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-secondary"></div>
        )}
      </CardFooter>
    </Card>
  );
}
