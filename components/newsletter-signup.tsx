"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to receive the newsletter.",
  }),
});

export function NewsletterSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      consent: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Subscription successful!",
          description:
            data.message ||
            "Thank you for subscribing to The Future Human Journal.",
        });
        form.reset();
      } else {
        toast({
          title: "Subscription failed",
          description: data.error || data.message || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network error",
        description: "Could not connect to the server.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jane Doe"
                    {...field}
                    className="border-primary/20 focus-visible:ring-primary text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="jane@example.com"
                    {...field}
                    className="border-primary/20 focus-visible:ring-primary text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-4 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-1"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm">
                  I agree to receive the newsletter and understand I can
                  unsubscribe anytime.
                </FormLabel>
                <FormDescription className="text-xs">
                  We respect your privacy and will never share your information.
                </FormDescription>
              </div>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="sm"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden group text-sm"
          disabled={isSubmitting}
        >
          <span className="relative z-10">
            {isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
          </span>
          <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          {/* Add a small yellow accent */}
          <span className="absolute top-0 right-0 h-1 w-6 bg-accent-secondary/70"></span>
        </Button>
      </form>
    </Form>
  );
}
