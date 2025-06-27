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
    <header
      className="sticky top-0 z-50 w-full border-b border-white/30"
      style={{
        backdropFilter: "blur(23px) saturate(200%)",
        WebkitBackdropFilter: "blur(23px) saturate(200%)",
        background:
          "linear-gradient(135deg, rgba(234, 234, 234, 0.6) 0%, rgba(149, 149, 149, 0.4) 100%)",
        border: "1px solid rgba(209, 213, 219, 0.3)",
      }}
    >
      <div className="container flex h-16 items-center justify-between px-8">
        <Link href="/" className="flex items-center space-x-4">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-black">
            <span className="absolute inset-0 rounded-md border border-gray-300"></span>
            <span className="text-sm font-bold">FHJ</span>
            <span className="absolute -bottom-0.5 right-0 h-0.5 w-2 bg-accent-secondary"></span>
          </div>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-6">
          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <nav
            className={cn(
              "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in bg-white/70 backdrop-blur-md md:static md:z-auto md:h-auto md:grid-flow-col md:auto-cols-max md:gap-3 md:p-0 md:pb-0 md:shadow-none md:bg-transparent md:backdrop-blur-none md:justify-end",
              isOpen ? "slide-in-from-bottom-80" : "hidden md:grid"
            )}
          >
            <Link
              href="/"
              className="flex items-center text-base font-medium text-white transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <span className="hidden md:inline-block mx-2 self-center text-white/40">
              |
            </span>
            <Link
              href="/articles"
              className="flex items-center text-base font-medium text-white transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Articles
            </Link>
            <span className="hidden md:inline-block mx-2 self-center text-white/40">
              |
            </span>
            <Link
              href="/about"
              className="flex items-center text-base font-medium text-white transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <span className="hidden md:inline-block mx-2 self-center text-white/40">
              |
            </span>
            <a
              href="https://future-human-labs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-base font-medium text-white transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Future Human Labs
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="hidden md:flex border-cyan-400 text-cyan-400 bg-transparent hover:bg-cyan-400/10 hover:text-cyan-500 focus:ring-cyan-400 focus:border-cyan-400 transition-colors duration-200 text-xs font-semibold px-3 py-1.5 rounded-md ml-4"
          >
            <Link href="/subscribe">Subscribe</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden md:flex bg-cyan-400/70 text-white hover:bg-cyan-400/90 border-none shadow-[0_0_6px_rgba(0,188,212,0.3)] hover:shadow-[0_0_8px_rgba(0,188,212,0.4)] relative overflow-hidden group text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200"
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
