"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TagInput } from "@/components/ui/tag-input";

const articleFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500, "Excerpt is too long").optional(),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author name is too long"),
  category: z.string().max(50, "Category name is too long").optional(),
  tags: z.array(z.string()).optional(),
  cover_image_url: z
    .string()
    .url("Invalid URL format")
    .max(500, "URL is too long")
    .optional()
    .or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

export default function ManageArticleForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const articleId = searchParams.get("id");
  const isEditMode = Boolean(articleId);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      tags: [],
      cover_image_url: "",
      status: "draft",
    },
  });

  React.useEffect(() => {
    if (isEditMode && articleId) {
      setIsLoading(true);
      fetch(`${API_BASE_URL}/articles/${articleId}`)
        .then(async (res) => {
          if (!res.ok) {
            let errorMsg = `Failed to fetch article: ${res.statusText}`;
            try {
              const errorData = await res.json();
              errorMsg = errorData.error || errorMsg;
            } catch (e) {
              /* Ignore parsing error */
            }
            throw new Error(errorMsg);
          }
          return res.json();
        })
        .then((data) => {
          const transformedData = {
            ...data,
            cover_image_url: data.cover_image || "",
            tags: Array.isArray(data.tags) ? data.tags : [],
          };
          form.reset(transformedData);
          toast.success("Article data loaded for editing.");
        })
        .catch((err) => {
          console.error("Error fetching article:", err);
          toast.error(err.message || "Could not fetch article data.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [articleId, isEditMode, form, router, API_BASE_URL]);

  const onSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    const url = isEditMode
      ? `${API_BASE_URL}/articles/${articleId}`
      : `${API_BASE_URL}/articles`;
    const method = isEditMode ? "PUT" : "POST";

    const payload: Omit<ArticleFormData, "cover_image_url"> & {
      cover_image?: string;
    } = {
      ...data,
      cover_image: data.cover_image_url,
    };
    delete (payload as Partial<ArticleFormData>).cover_image_url;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = `Submission failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMsg =
            errorData.error ||
            (errorData.errors ? JSON.stringify(errorData.errors) : errorMsg);
        } catch (e) {
          /* Ignore parsing error */
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      toast.success(
        isEditMode
          ? "Article updated successfully!"
          : "Article created successfully!"
      );

      // Revalidate the articles list
      try {
        await fetch("/api/revalidate?tag=articles", {
          method: "POST",
          headers: {
            "x-revalidate-token":
              process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "",
          },
        });
        toast.info("Article list cache cleared.");
      } catch (revalError) {
        console.error("Failed to revalidate:", revalError);
        toast.warning("Could not automatically refresh the article list.");
      }

      if (!isEditMode) {
        form.reset();
      } else {
        const transformedData = {
          ...result,
          cover_image_url: result.cover_image || "",
          tags: Array.isArray(result.tags) ? result.tags : [],
        };
        form.reset(transformedData);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Loading article data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? `Edit Article (ID: ${articleId})` : "Create New Article"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter article title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (HTML)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your HTML content here... 
Example:
<h2>Section Title</h2>
<p>Your paragraph content with <strong>bold text</strong> and <em>italic text</em>.</p>
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>
<blockquote>Quote text here</blockquote>"
                    className="min-h-[400px] font-mono text-sm"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter your article content as HTML. You can use standard HTML
                  tags like &lt;h1&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;,
                  &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;,
                  &lt;blockquote&gt;, &lt;a&gt;, &lt;img&gt;, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Short summary of the article"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Author's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Technology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagInput
                    {...field}
                    placeholder="Enter a tag and press enter"
                    tags={field.value || []}
                    setTags={(newTags) => {
                      form.setValue("tags", newTags, { shouldValidate: true });
                    }}
                    className="sm:min-w-[450px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cover_image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Published articles will be visible to the public.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Article"
                : "Create Article"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
