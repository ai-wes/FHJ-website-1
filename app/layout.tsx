import type React from "react";
import type { Metadata } from "next";
import { Mona_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Future Human Journal",
    template: "%s | Future Human Journal",
  },
  description:
    "Exploring the future of humanity through technology, science, and philosophy. Discover insights on AI, biotechnology, neuroscience, and human enhancement.",
  keywords: [
    "future technology",
    "artificial intelligence",
    "biotechnology",
    "neuroscience",
    "human enhancement",
    "transhumanism",
    "longevity",
    "consciousness",
    "philosophy",
    "science",
  ],
  authors: [{ name: "Future Human Journal" }],
  creator: "Future Human Journal",
  publisher: "Future Human Journal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://futurehumanjournal.com"
  ),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Future Human Journal RSS Feed" },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Future Human Journal",
    description:
      "Exploring the future of humanity through technology, science, and philosophy. Discover insights on AI, biotechnology, neuroscience, and human enhancement.",
    siteName: "Future Human Journal",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Future Human Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Future Human Journal",
    description:
      "Exploring the future of humanity through technology, science, and philosophy.",
    images: ["/og-image.jpg"],
    creator: "@futurehuman",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://futurehumanjournal.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Future Human Journal",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Exploring the future of humanity through technology, science, and philosophy",
    sameAs: [
      "https://twitter.com/futurehuman",
      "https://linkedin.com/company/futurehuman",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Future Human Journal RSS Feed"
          href="/feed.xml"
        />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
