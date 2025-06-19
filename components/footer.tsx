"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-background relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-[20%] right-[10%] h-[1px] w-[150px] -rotate-45 bg-primary/10" />
        <div className="absolute top-[30%] left-[15%] h-[1px] w-[100px] rotate-45 bg-primary/10" />
      </div>
      <div className="container py-12 md:py-16 px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-base font-medium">The Future Human Journal</h3>
            <p className="text-xs text-muted-foreground">
              — Exploring the future of humanity, one insight at a time.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-medium">Navigation</h3>
            <ul className="space-y-3 text-xs">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-muted-foreground hover:text-primary"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/topics"
                  className="text-muted-foreground hover:text-primary"
                >
                  Topics
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-medium">Topics</h3>
            <ul className="space-y-3 text-xs">
              <li>
                <Link
                  href="/topics/ai"
                  className="text-muted-foreground hover:text-primary"
                >
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link
                  href="/topics/biotech"
                  className="text-muted-foreground hover:text-primary"
                >
                  Biotechnology
                </Link>
              </li>
              <li>
                <Link
                  href="/topics/future-of-work"
                  className="text-muted-foreground hover:text-primary"
                >
                  Future of Work
                </Link>
              </li>
              <li>
                <Link
                  href="/topics/transhumanism"
                  className="text-muted-foreground hover:text-primary"
                >
                  Transhumanism
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-medium">Subscribe</h3>
            <p className="text-xs text-muted-foreground">
              Join our newsletter to stay updated on the latest insights.
            </p>
            <Link
              href="/subscribe"
              className="text-xs text-primary hover:underline"
            >
              Subscribe Now
            </Link>
          </div>
        </div>
        <div className="mt-12 border-t border-primary/10 pt-8 text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} The Future Human Journal. All rights
            reserved.
          </p>
          {/* Add a small yellow accent line */}
          <div className="mx-auto mt-4 flex items-center justify-center">
            <div className="h-px w-4 bg-primary/30"></div>
            <div className="h-px w-4 bg-accent-secondary/70"></div>
            <div className="h-px w-4 bg-primary/30"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
