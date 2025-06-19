"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { NeuralNetworkBackground } from "@/components/neural-network-background";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setMessage(data.error || data.message || "An error occurred.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    }
    setIsSubmitting(false);
  }

  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      {/* Dynamic neural network background (lowest layer) */}
      <NeuralNetworkBackground />

      {/* Digital human image (middle layer) */}
      <div className="absolute inset-0 -z-5 flex justify-end items-center overflow-hidden">
        <div className="relative h-full w-full md:w-[60%] lg:w-[50%] opacity-90">
          <Image
            src="/images/digital-human-hero.png"
            alt="Digital human visualization"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 50vw"
            className="object-contain object-right-center"
            priority
          />
        </div>
      </div>

      {/* Abstract geometric elements (top layer) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-px w-[80%] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 right-0 h-px w-[60%] bg-gradient-to-l from-transparent via-primary/50 to-transparent" />
        {/* Changed this circular element to yellow */}
        <div className="absolute top-[20%] right-[10%] h-[200px] w-[200px] rounded-full border border-accent-secondary/30" />
        <div className="absolute bottom-[10%] left-[5%] h-[150px] w-[150px] rounded-full border border-primary/10" />
        <div className="absolute top-[40%] left-[20%] h-[1px] w-[100px] rotate-45 bg-primary/20" />
        <div className="absolute bottom-[30%] right-[25%] h-[1px] w-[150px] -rotate-45 bg-primary/20" />
        {/* Subtle yellow accent */}
        <div className="absolute top-[15%] left-[30%] h-[3px] w-[30px] bg-accent-secondary/60" />
        <div className="absolute bottom-[25%] right-[15%] h-[3px] w-[20px] bg-accent-secondary/60" />
      </div>

      {/* Content (foreground) */}
      <div className="container relative z-10 mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center mx-auto max-w-6xl animate-fade-up min-h-[420px] md:min-h-[520px]">
          {/* Left column: Title and subheading */}
          <div className="w-full flex flex-col justify-center h-full -translate-y-[20vh]">
            <span className="text-white font-inter text-lg md:text-2xl lg:text-3xl uppercase tracking-widest mt-2 pr-1">
              THE
            </span>
            <div className="flex flex-row items-end">
              <span
                className=" uppercase text-4xl md:text-6xl lg:text-7xl tracking-tight text-[#b6a14b] font-inter  "
                style={{ letterSpacing: "0.02em" }}
              >
                FUTURE
              </span>
              <span
                className="font-bold font-inter uppercase text-4xl md:text-6xl lg:text-7xl tracking-tight text-accentBlue"
                style={{ letterSpacing: "0.01em" }}
              >
                HUMAN
              </span>
            </div>
            <div className="flex flex-row justify-end">
              <span className="text-white font-inter text-lg md:text-2xl lg:text-3xl uppercase tracking-widest mt-2 pr-1">
                JOURNAL
              </span>
            </div>
            <p className="max-w-xl text-base md:text-lg text-white mt-8">
              Weekly intelligence from the edge of biology, AI, and the race to
              transcend our limits.
            </p>
            <p className="max-w-xl text-base md:text-lg text-white mt-4">
              Decode the breakthroughs, dilemmas, and power plays shaping the
              next version of us.
            </p>
          </div>
          {/* Right column: Signup form */}
          <div className="w-full flex flex-col items-center justify-center h-full translate-y-[20vh]">
            <form
              onSubmit={handleSignup}
              className="flex flex-col items-end gap-2 w-full max-w-xs md:w-80"
            >
              <div className="flex w-full">
                <input
                  type="email"
                  required
                  placeholder="Your best email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-l-md px-3 py-2 border-2 border-[#b6a14b] bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#b6a14b]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-r-md px-4 py-2 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm border-2 border-l-0 border-[#b6a14b]"
                >
                  {isSubmitting ? "Signing up..." : "Subscribe Free"}
                </button>
              </div>
              {message && (
                <div className="text-xs text-muted-foreground pt-1">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
