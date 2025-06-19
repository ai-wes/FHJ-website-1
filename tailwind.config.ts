import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          secondary: "hsl(var(--accent-secondary))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "hsl(var(--foreground))",
            fontSize: "0.75rem",
            lineHeight: "1.4",
            a: {
              color: "hsl(var(--primary))",
              "&:hover": {
                color: "hsl(var(--primary))",
              },
            },
            h1: {
              color: "hsl(var(--foreground))",
              fontSize: "1.125rem",
              marginBottom: "0.5rem",
              marginTop: "1rem",
            },
            h2: {
              color: "hsl(var(--foreground))",
              fontSize: "1rem",
              marginBottom: "0.5rem",
              marginTop: "0.75rem",
            },
            h3: {
              color: "hsl(var(--foreground))",
              fontSize: "0.875rem",
              marginBottom: "0.25rem",
              marginTop: "0.5rem",
            },
            h4: {
              color: "hsl(var(--foreground))",
              fontSize: "0.75rem",
              marginBottom: "0.25rem",
              marginTop: "0.5rem",
            },
            p: {
              fontSize: "0.75rem",
              lineHeight: "1.4",
              marginBottom: "0.5rem",
            },
            li: {
              fontSize: "0.75rem",
              lineHeight: "1.4",
              marginBottom: "0",
            },
            ul: {
              marginBottom: "0.5rem",
            },
            ol: {
              marginBottom: "0.5rem",
            },
            strong: {
              color: "hsl(var(--foreground))",
            },
            code: {
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--muted))",
              padding: "0.125rem 0.25rem",
              borderRadius: "0.25rem",
              fontWeight: "400",
              fontSize: "0.6875rem",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              backgroundColor: "hsl(var(--muted))",
              color: "hsl(var(--foreground))",
              fontSize: "0.6875rem",
              padding: "0.75rem",
            },
            blockquote: {
              borderLeftColor: "hsl(var(--primary))",
              color: "hsl(var(--muted-foreground))",
              fontSize: "0.75rem",
              marginBottom: "0.5rem",
              paddingLeft: "0.75rem",
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
