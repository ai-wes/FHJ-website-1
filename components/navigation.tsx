"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <span className="absolute inset-0 rounded-md border border-primary/20"></span>
              <span className="text-sm font-bold">FHJ</span>
              {/* Add a small yellow accent */}
              <span className="absolute -bottom-0.5 right-0 h-0.5 w-2 bg-accent-secondary"></span>
            </div>
          </Link>
        </div>
        <nav
          className={cn(
            "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:static md:z-auto md:h-auto md:grid-flow-col md:auto-cols-max md:gap-8 md:p-0 md:pb-0 md:shadow-none",
            isOpen ? "slide-in-from-bottom-80" : "hidden md:grid"
          )}
        >
          <Link
            href="/"
            className="flex items-center text-base font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/articles"
            className="flex items-center text-base font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Articles
          </Link>
          <Link
            href="/about"
            className="flex items-center text-base font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <a
            href="https://future-human-labs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-base font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Future Human Labs
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="hidden md:flex hover:text-primary hover:bg-primary/10 text-sm"
          >
            <Link href="/subscribe">Subscribe</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden md:flex bg-slate-100 text-slate-900 hover:bg-slate-200 border border-cyan-400/50 shadow-[0_0_6px_rgba(0,188,212,0.3)] hover:shadow-[0_0_8px_rgba(0,188,212,0.4)] relative overflow-hidden group text-sm transition-all duration-200"
          >
            <Link href="/subscribe">
              <span className="relative z-10">Join Now</span>
              <span className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
