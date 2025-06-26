/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  // Configure allowed development origins
  allowedDevOrigins: [
    "localhost:3000",
    "192.168.1.44:3000",
    "100.20.92.101",
    "44.225.181.72",
    "44.227.217.144",
    "https://fhj-flask-backend-g0k8.onrender.com",
  ],
  // Optimize for static generation
  output: "standalone",
  // Enable compression
  compress: true,
  // Optimize for SEO
  generateEtags: true,
  // Enable static optimization
  trailingSlash: false,
  // Configure headers for better caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/articles/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
