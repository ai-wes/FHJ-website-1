"use client";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
  Eye,
  Calendar,
  Tag,
  Upload,
  RefreshCw,
  ChevronDown,
  Copy,
} from "lucide-react";
import { TagInput } from "@/components/ui/tag-input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Article {
  id?: string;
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author?: string;
  date: string;
  image?: string;
  cover_image?: string;
  reading_time?: string;
  status: "draft" | "published" | "archived";
  featured?: boolean;
  tags?: string[];
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [activeTab, setActiveTab] = useState("create");

  // Simple Markdown form state
  const [markdownContent, setMarkdownContent] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Future Human Labs");
  const [category, setCategory] = useState("Technology");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // New state for enhanced features
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showTemplate, setShowTemplate] = useState(false);
  const [showBulkImageUpdate, setShowBulkImageUpdate] = useState(false);
  const [bulkImageUpdates, setBulkImageUpdates] = useState<{[key: string]: string}>({});

  // Multi-platform posting state
  const [multiTitle, setMultiTitle] = useState("");
  const [multiContent, setMultiContent] = useState("");
  const [multiTags, setMultiTags] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showMultiPreview, setShowMultiPreview] = useState(false);

  // Calendar state
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventPlatform, setNewEventPlatform] = useState("WordPress");
  const [calendarView, setCalendarView] = useState("month");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedArticleForSchedule, setSelectedArticleForSchedule] = useState<Article | null>(null);

  // Platform credentials state
  const [credentials, setCredentials] = useState({
    wordpress: { url: "", username: "", password: "" },
    medium: { token: "" },
    linkedin: { token: "" },
    twitter: { apiKey: "", apiSecret: "", accessToken: "", accessTokenSecret: "" }
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const markdownTemplate = `# [Article Title]

## Introduction

Start with a compelling introduction that hooks your readers and outlines what they'll learn.

## Main Section 1

### Subsection 1.1

Your content here with **bold text** and *italic text* for emphasis.

- Bullet point 1
- Bullet point 2
- Bullet point 3

### Subsection 1.2

1. Numbered item 1
2. Numbered item 2
3. Numbered item 3

## Technical Details

Include code blocks with syntax highlighting:

\`\`\`javascript
function example() {
  return "Hello World";
}
\`\`\`

### Important Concepts

> Use blockquotes for important insights or quotes
> 
> — Author Name

## Key Features

| Feature | Description | Benefits |
|---------|-------------|----------|
| Feature 1 | Description here | Benefit here |
| Feature 2 | Description here | Benefit here |

## Conclusion

Summarize your key points and provide actionable takeaways.

### Resources

- [Link to resource 1](https://example.com)
- [Link to resource 2](https://example.com)

---

*Note: Use Markdown syntax for consistent formatting. The styling will be automatically applied on the frontend.*`;

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(markdownTemplate);
      alert("Template copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy template:", err);
      alert("Failed to copy template. Please copy manually.");
    }
  };

  const handleBulkImageUpdate = async () => {
    try {
      const updates = Object.entries(bulkImageUpdates)
        .filter(([id, url]) => url.trim())
        .map(([id, url]) => ({ id, image_url: url.trim() }));
      
      if (updates.length === 0) {
        alert("No images to update");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/articles/bulk-update-images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Successfully updated ${result.updated_count} articles with images!`);
        setBulkImageUpdates({});
        setShowBulkImageUpdate(false);
        await loadArticles(); // Refresh the list
      } else {
        alert("Failed to update images");
      }
    } catch (error) {
      console.error("Error updating images:", error);
      alert("Error updating images");
    }
  };

  useEffect(() => {
    loadArticles();
    loadDashboardStats();
    loadNotifications();
    loadCalendarEvents();
  }, []);
  
  // Separate useEffect for scheduled posts check
  useEffect(() => {
    if (calendarEvents.length === 0 || articles.length === 0) return;
    
    // Check for scheduled posts every minute
    const interval = setInterval(() => {
      checkScheduledPosts();
    }, 60000); // 60 seconds
    
    // Initial check
    checkScheduledPosts();
    
    return () => clearInterval(interval);
  }, [calendarEvents, articles]);
  
  const checkScheduledPosts = async () => {
    const now = new Date();
    const dueEvents = calendarEvents.filter(event => {
      if (event.type !== 'article' || event.status === 'published') return false;
      const eventDate = new Date(event.scheduled_date);
      return eventDate <= now;
    });
    
    for (const event of dueEvents) {
      // Find the article
      const article = articles.find(a => a.id === event.articleId);
      if (article && article.status !== 'published') {
        // Publish the article
        const updatedArticle = {
          ...article,
          status: 'published' as const,
          date: new Date().toISOString().split('T')[0]
        };
        
        await handleSaveArticle(updatedArticle);
        
        // Update event status
        const updatedEvents = calendarEvents.map(e => 
          e.id === event.id ? { ...e, status: 'published' } : e
        );
        saveCalendarEvents(updatedEvents);
        
        // Show notification
        alert(`Article "${article.title}" has been automatically published to ${event.platform}!`);
      }
    }
  };

  const loadDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/quick-stats`);
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const loadCalendarEvents = () => {
    // Load from localStorage
    const stored = localStorage.getItem('calendarEvents');
    if (stored) {
      setCalendarEvents(JSON.parse(stored));
    }
  };

  const saveCalendarEvents = (events: any[]) => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    setCalendarEvents(events);
  };

  const handleAddCalendarEvent = () => {
    if (!newEventTitle || !newEventDate) {
      alert("Please provide event title and date");
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      scheduled_date: newEventDate,
      platform: newEventPlatform,
      type: "scheduled_post"
    };

    const updatedEvents = [...calendarEvents, newEvent];
    saveCalendarEvents(updatedEvents);
    
    setNewEventTitle("");
    setNewEventDate("");
    alert("Event added successfully!");
  };

  const handleMultiPlatformPost = async () => {
    if (!multiTitle || !multiContent || selectedPlatforms.length === 0) {
      alert("Please provide title, content, and select at least one platform");
      return;
    }

    setIsPosting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/multi-platform/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: multiTitle,
          content: multiContent,
          tags: multiTags.split(",").map(tag => tag.trim()).filter(tag => tag),
          platforms: selectedPlatforms,
          credentials: credentials
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Post deployed successfully to ${result.successful_platforms?.length || 0} platforms!`);
        // Clear form
        setMultiTitle("");
        setMultiContent("");
        setMultiTags("");
        setSelectedPlatforms([]);
        setShowMultiPreview(false);
      } else {
        alert("Failed to deploy post to some platforms");
      }
    } catch (error) {
      console.error("Error deploying multi-platform post:", error);
      alert("Error deploying post");
    } finally {
      setIsPosting(false);
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const loadArticles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`);
      if (response.ok) {
        const data = await response.json();
        const articlesData = data.articles || [];
        setArticles(
          articlesData.map((article: any) => ({
            ...article,
            id: article.id || article._id,
            image: article.cover_image || article.image,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleSaveArticle = async (article: Article) => {
    try {
      const articleData = {
        ...article,
        slug: article.slug || generateSlug(article.title),
        reading_time: estimateReadingTime(article.content),
        cover_image: article.image,
      };

      const response = await fetch(`${API_BASE_URL}/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        await loadArticles();
        setEditingArticle(null);
      } else {
        console.error("Failed to save article");
      }
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const handleSaveDraft = async () => {
    if (!title || !markdownContent) {
      alert("Please provide both title and content");
      return;
    }

    setIsPosting(true);
    try {
      const articleData: Article = {
        slug: generateSlug(title),
        title: title,
        excerpt: excerpt,
        content: markdownContent,
        cover_image: featuredImage || "/images/default-blog.jpg",
        category: category,
        author: author,
        date: new Date().toISOString().split("T")[0],
        reading_time: estimateReadingTime(markdownContent),
        status: "draft",
        featured: false,
        tags: tags,
        content_type: "blog_post",
        priority: "medium",
        workflow_stage: "draft",
      };

      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        await loadArticles();
        // Clear form
        setTitle("");
        setMarkdownContent("");
        setExcerpt("");
        setFeaturedImage("");
        setTags([]);
        setShowPreview(false);
        alert("Article saved as draft!");
        setActiveTab("manage"); // Switch to manage tab to see the draft
      } else {
        console.error("Failed to save draft");
        alert("Failed to save draft. Please try again.");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Error saving draft. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const handlePostArticle = async () => {
    if (!title || !markdownContent) {
      alert("Please provide both title and content");
      return;
    }

    setIsPosting(true);
    try {
      const articleData: Article = {
        slug: generateSlug(title),
        title: title,
        excerpt: excerpt,
        content: markdownContent,
        cover_image: featuredImage || "/images/default-blog.jpg", // Add featured image
        category: category,
        author: author,
        date: new Date().toISOString().split("T")[0],
        reading_time: estimateReadingTime(markdownContent),
        status: "draft", // Start as draft instead of published
        featured: false,
        tags: tags,
        content_type: "blog_post",
        priority: "medium",
        workflow_stage: "draft",
      };

      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        await loadArticles();
        // Clear form
        setTitle("");
        setMarkdownContent("");
        setExcerpt("");
        setFeaturedImage("");
        setTags([]);
        setShowPreview(false);
        alert("Article posted successfully!");
      } else {
        console.error("Failed to create article");
        alert("Failed to post article. Please try again.");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Error posting article. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm("Are you sure you want to archive this article? (It can be restored later)")) return;

    try {
      // Since DELETE is not supported, we'll update the status to "archived"
      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });

      if (response.ok) {
        await loadArticles();
        alert("Article archived successfully!");
      } else {
        const errorText = await response.text();
        console.error("Failed to archive article:", response.status, errorText);
        alert(`Failed to archive article. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error archiving article:", error);
      alert("Error archiving article. Please check your connection and try again.");
    }
  };

  const handlePublishArticle = async (article: Article) => {
    const updatedArticle = {
      ...article,
      status: "published" as const,
      date: new Date().toISOString().split("T")[0],
    };
    await handleSaveArticle(updatedArticle);
  };

  const handleStatusChange = async (articleId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/articles/${articleId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        await loadArticles();
        await loadDashboardStats(); // Refresh stats
      } else {
        console.error("Failed to update article status");
      }
    } catch (error) {
      console.error("Error updating article status:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          Loading admin panel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-full px-4 py-2">
        <div className="mb-3">
          <h1 className="text-xl font-bold text-gray-100">
            Admin Dashboard
          </h1>
        </div>

        {/* Dashboard Stats */}
        {dashboardStats && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded p-2 text-white">
              <div className="text-lg font-bold">
                {dashboardStats.totalContent || 0}
              </div>
              <div className="text-xs opacity-90">Total Articles</div>
            </div>
            <div 
              className="bg-gradient-to-r from-green-600 to-green-700 rounded p-2 text-white cursor-pointer hover:from-green-700 hover:to-green-800 transition-all"
              onClick={() => setActiveTab("manage")}
              title="View Drafts"
            >
              <div className="text-lg font-bold">
                {dashboardStats.drafts || 0}
              </div>
              <div className="text-xs opacity-90">Drafts</div>
            </div>
            <div 
              className="bg-gradient-to-r from-purple-600 to-purple-700 rounded p-2 text-white cursor-pointer hover:from-purple-700 hover:to-purple-800 transition-all"
              onClick={() => setActiveTab("calendar")}
              title="View Calendar"
            >
              <div className="text-lg font-bold">
                {dashboardStats.scheduled || 0}
              </div>
              <div className="text-xs opacity-90">Scheduled</div>
            </div>
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded p-2 text-white">
              <div className="text-lg font-bold">
                {dashboardStats.dueSoon || 0}
              </div>
              <div className="text-xs opacity-90">Due Soon</div>
            </div>
          </div>
        )}


        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-2"
        >
          <TabsList className="h-8 bg-gray-800 border border-gray-700">
            <TabsTrigger value="create" className="text-xs h-7 data-[state=active]:bg-gray-700">
              <Plus className="w-3 h-3 mr-1" />
              Create
            </TabsTrigger>
            <TabsTrigger value="manage" className="text-xs h-7 data-[state=active]:bg-gray-700">
              <FileText className="w-3 h-3 mr-1" />
              Manage
            </TabsTrigger>
            <TabsTrigger value="multi-platform" className="text-xs h-7 data-[state=active]:bg-gray-700">
              <Upload className="w-3 h-3 mr-1" />
              Multi-Platform
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs h-7 data-[state=active]:bg-gray-700">
              <Calendar className="w-3 h-3 mr-1" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs h-7 data-[state=active]:bg-gray-700">📊 Analytics</TabsTrigger>
          </TabsList>


          <TabsContent value="create" className="space-y-2">
            {/* Simple HTML Article Creator */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1 text-gray-100">
                <Plus className="w-3 h-3" />
                Create New Article
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-8 text-xs bg-gray-700 border-gray-600 text-gray-100"
                  />
                  <Input
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="h-8 text-xs bg-gray-700 border-gray-600 text-gray-100"
                  />
                  <select
                    className="h-8 px-2 py-1 text-xs border rounded-md bg-gray-700 border-gray-600 text-gray-100"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Technology">Technology</option>
                    <option value="AI">AI</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Health">Health</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Society">Society</option>
                    <option value="Environment">Environment</option>
                    <option value="Neuroscience">Neuroscience</option>
                  </select>
                </div>

                <Input
                  placeholder="Article Excerpt (Brief description)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="h-8 text-xs bg-gray-700 border-gray-600 text-gray-100"
                />

                <Input
                  placeholder="Featured Image URL"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="h-8 text-xs bg-gray-700 border-gray-600 text-gray-100"
                />

                <TagInput
                  tags={tags}
                  onTagsChange={setTags}
                  placeholder="Tags (press Enter)"
                  className="text-xs bg-gray-700 border-gray-600"
                />

                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-400">Markdown Content</label>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowTemplate(!showTemplate)}
                        className="text-xs h-6 px-2 text-gray-400 hover:text-gray-200"
                      >
                        Guide
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={copyTemplate}
                        className="text-xs h-6 px-2 text-gray-400 hover:text-gray-200"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  {showTemplate && (
                    <div className="p-2 bg-gray-900 border border-gray-700 rounded mb-1">
                      <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
                        {markdownTemplate}
                      </pre>
                    </div>
                  )}
                  
                  <Textarea
                    placeholder="Write your article in Markdown format..."
                    className="min-h-[400px] font-mono text-xs bg-gray-700 border-gray-600 text-gray-100"
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    disabled={!markdownContent}
                    className="h-7 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    {showPreview ? "Hide" : "Preview"}
                  </Button>
                  <Button
                    onClick={handleSaveDraft}
                    disabled={!title || !markdownContent || isPosting}
                    className="h-7 text-xs bg-gray-600 hover:bg-gray-700"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    {isPosting ? "Saving..." : "Save Draft"}
                  </Button>
                  <Button
                    onClick={handlePostArticle}
                    disabled={!title || !markdownContent || isPosting}
                    className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    {isPosting ? "Posting..." : "Post Article"}
                  </Button>
                  <Button
                    onClick={() => {
                      // First save the article as draft
                      if (!title || !markdownContent) {
                        alert("Please provide title and content before scheduling");
                        return;
                      }
                      
                      const tempArticle: Article = {
                        id: "temp-" + Date.now(),
                        slug: generateSlug(title),
                        title: title,
                        excerpt: excerpt,
                        content: markdownContent,
                        cover_image: featuredImage || "",
                        category: category,
                        author: author,
                        date: new Date().toISOString().split("T")[0],
                        reading_time: estimateReadingTime(markdownContent),
                        status: "draft",
                        featured: false,
                        tags: tags,
                      };
                      
                      setSelectedArticleForSchedule(tempArticle);
                      setShowScheduler(true);
                    }}
                    disabled={!title || !markdownContent}
                    className="h-7 text-xs bg-yellow-600 hover:bg-yellow-700"
                    title="Schedule this post"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Schedule
                  </Button>
                </div>

                {showPreview && markdownContent && (
                  <div className="p-3 mt-2 bg-gray-900 border border-gray-700 rounded">
                    <h4 className="text-xs font-semibold mb-2 text-gray-400">
                      Preview:
                    </h4>
                    <ReactMarkdown
                      className="prose prose-sm max-w-none prose-invert text-xs"
                      remarkPlugins={[remarkGfm]}
                    >
                      {markdownContent}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {/* Existing Articles */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">
                  Articles ({articles.length})
                </h3>
                <div className="flex gap-1">
                  <Button onClick={loadArticles} variant="ghost" size="sm" className="h-7 px-2">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh
                  </Button>
                  <Button size="sm" onClick={() => setActiveTab("create")} className="h-7 px-2">
                    <Plus className="w-3 h-3 mr-1" />
                    New
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowBulkImageUpdate(true)} className="h-7 px-2">
                    <Upload className="w-3 h-3 mr-1" />
                    Images
                  </Button>
                </div>
              </div>

              {articles.length === 0 ? (
                <div className="p-8 text-center bg-gray-800 border border-gray-700 rounded-lg">
                  <FileText className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-400 text-sm">
                    No articles found. Create your first article above!
                  </p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="p-2 bg-gray-800 border border-gray-700 rounded"
                    >
                      {editingArticle?.id === article.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              value={editingArticle.title}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  title: e.target.value,
                                })
                              }
                            />
                            <Input
                              value={editingArticle.author || ""}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  author: e.target.value,
                                })
                              }
                            />
                            <select
                              className="px-3 py-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                              value={editingArticle.category}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  category: e.target.value,
                                })
                              }
                            >
                              <option value="Technology">Technology</option>
                              <option value="AI">AI</option>
                              <option value="Biotechnology">
                                Biotechnology
                              </option>
                              <option value="Health">Health</option>
                              <option value="Lifestyle">Lifestyle</option>
                              <option value="Philosophy">Philosophy</option>
                              <option value="Society">Society</option>
                              <option value="Environment">Environment</option>
                              <option value="Neuroscience">Neuroscience</option>
                            </select>
                            <Input
                              type="date"
                              value={editingArticle.date}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  date: e.target.value,
                                })
                              }
                            />
                          </div>

                          <Input
                            value={editingArticle.excerpt}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                excerpt: e.target.value,
                              })
                            }
                            placeholder="Article excerpt"
                          />

                          <Input
                            value={editingArticle.cover_image || editingArticle.image || ""}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                cover_image: e.target.value,
                              })
                            }
                            placeholder="Featured image URL"
                          />

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Tags</label>
                            <TagInput
                              tags={editingArticle.tags || []}
                              onTagsChange={(newTags) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  tags: newTags,
                                })
                              }
                              placeholder="Enter tags and press Enter"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Article Content (Markdown)
                            </label>
                            <Textarea
                              value={editingArticle.content}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  content: e.target.value,
                                })
                              }
                              placeholder="Edit your Markdown content..."
                              className="min-h-[400px] font-mono text-sm"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSaveArticle(editingArticle)}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingArticle(null)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xs font-semibold text-gray-100 truncate flex-1">
                                {article.title}
                              </h3>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                article.status === "published"
                                  ? "bg-green-900/50 text-green-400"
                                  : "bg-gray-700 text-gray-400"
                              }`}>
                                {article.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mb-1 line-clamp-1">
                              {article.excerpt}
                            </p>
                            <div className="flex gap-3 text-xs text-gray-500">
                              <span>{article.category}</span>
                              <span>{new Date(article.date).toLocaleDateString()}</span>
                              {article.reading_time && (
                                <span>{article.reading_time}</span>
                              )}
                            </div>
                            {article.tags && article.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {article.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="text-xs text-gray-400"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {article.tags.length > 3 && (
                                  <span className="text-xs text-gray-400">+{article.tags.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                window.open(
                                  `/articles/${article.slug}`,
                                  "_blank"
                                )
                              }
                              className="h-7 w-7 p-0"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingArticle(article)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedArticleForSchedule(article);
                                setShowScheduler(true);
                              }}
                              className="h-7 w-7 p-0 text-yellow-600"
                              title="Schedule Post"
                            >
                              <Calendar className="w-3 h-3" />
                            </Button>
                            {article.status === "draft" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handlePublishArticle(article)}
                                className="h-7 w-7 p-0 text-green-600"
                              >
                                <Upload className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const articleId = article.id || article._id;
                                if (articleId) {
                                  handleDeleteArticle(articleId);
                                } else {
                                  console.error("No article ID found:", article);
                                  alert("Cannot delete article: No ID found");
                                }
                              }}
                              className="h-7 w-7 p-0 text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="multi-platform" className="space-y-6">
            {/* Multi-Platform Posting */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Platform Credentials */}
              <div className="lg:col-span-1">
                <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Platform Credentials
                  </h3>
                  
                  {/* WordPress */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">WordPress</h4>
                    <div className="space-y-2">
                      <Input placeholder="WordPress URL" />
                      <Input placeholder="Username" />
                      <Input type="password" placeholder="Password" />
                    </div>
                  </div>

                  {/* Medium */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Medium</h4>
                    <Input type="password" placeholder="Integration Token" />
                  </div>

                  {/* LinkedIn */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">LinkedIn</h4>
                    <Input type="password" placeholder="Access Token" />
                  </div>

                  {/* Twitter */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Twitter</h4>
                    <div className="space-y-2">
                      <Input type="password" placeholder="API Key" />
                      <Input type="password" placeholder="API Secret" />
                      <Input type="password" placeholder="Access Token" />
                      <Input type="password" placeholder="Access Token Secret" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Content Creation */}
              <div className="lg:col-span-2">
                <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Create Multi-Platform Post
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                      </label>
                      <Input 
                      placeholder="Enter your post title" 
                      value={multiTitle}
                      onChange={(e) => setMultiTitle(e.target.value)}
                    />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Content
                      </label>
                      <Textarea 
                        placeholder="Write your post content here..."
                        className="min-h-[200px]"
                        value={multiContent}
                        onChange={(e) => setMultiContent(e.target.value)}
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tags
                      </label>
                      <Input 
                        placeholder="e.g., technology, AI, innovation (comma-separated)" 
                        value={multiTags}
                        onChange={(e) => setMultiTags(e.target.value)}
                      />
                    </div>

                    {/* Media Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Media
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400">
                            Images (JPG, PNG, GIF), Videos (MP4, WebM)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Platform Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Select Platforms
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="wordpress" 
                            className="rounded" 
                            checked={selectedPlatforms.includes("wordpress")}
                            onChange={() => handlePlatformToggle("wordpress")}
                          />
                          <label htmlFor="wordpress" className="text-sm">WordPress</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="medium" 
                            className="rounded" 
                            checked={selectedPlatforms.includes("medium")}
                            onChange={() => handlePlatformToggle("medium")}
                          />
                          <label htmlFor="medium" className="text-sm">Medium</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="linkedin" 
                            className="rounded" 
                            checked={selectedPlatforms.includes("linkedin")}
                            onChange={() => handlePlatformToggle("linkedin")}
                          />
                          <label htmlFor="linkedin" className="text-sm">LinkedIn</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="twitter" 
                            className="rounded" 
                            checked={selectedPlatforms.includes("twitter")}
                            onChange={() => handlePlatformToggle("twitter")}
                          />
                          <label htmlFor="twitter" className="text-sm">Twitter</label>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowMultiPreview(!showMultiPreview)}
                        disabled={!multiTitle || !multiContent}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {showMultiPreview ? "Hide Preview" : "Preview Post"}
                      </Button>
                      <Button 
                        onClick={handleMultiPlatformPost}
                        disabled={!multiTitle || !multiContent || selectedPlatforms.length === 0 || isPosting}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isPosting ? "Deploying..." : "Deploy Post"}
                      </Button>
                    </div>
                  </div>

                  {/* Multi-Platform Preview */}
                  {showMultiPreview && multiContent && (
                    <Card className="p-6 mt-4 bg-gray-50 dark:bg-gray-900">
                      <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
                        Preview for {selectedPlatforms.join(", ")} platforms:
                      </h4>
                      <div className="space-y-3">
                        <div className="font-semibold text-lg">{multiTitle}</div>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {multiContent.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                        {multiTags && (
                          <div className="flex gap-1 flex-wrap">
                            {multiTags.split(",").map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-3">
            {/* Enhanced Content Calendar */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
              {/* Calendar Controls */}
              <div className="xl:col-span-1">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-3">
                  <h4 className="text-sm font-semibold mb-3 text-gray-100">
                    Add New Event
                  </h4>
                  <div className="space-y-2">
                    <Input 
                      placeholder="Event Title" 
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="h-8 text-xs bg-gray-700 border-gray-600 text-gray-100"
                    />
                    <Input 
                      type="datetime-local" 
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="h-8 text-xs bg-gray-700 border-gray-600 text-gray-100"
                    />
                    <select 
                      className="w-full h-8 px-2 py-1 text-xs border rounded-md bg-gray-700 border-gray-600 text-gray-100"
                      value={newEventPlatform}
                      onChange={(e) => setNewEventPlatform(e.target.value)}
                    >
                      <option value="WordPress">WordPress</option>
                      <option value="Medium">Medium</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter</option>
                    </select>
                    <Button 
                      className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddCalendarEvent}
                      disabled={!newEventTitle || !newEventDate}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Event
                    </Button>
                  </div>
                </div>

                {/* Platform Legend */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <h4 className="text-sm font-semibold mb-2 text-gray-100">
                    Platform Colors
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded bg-yellow-500"></div>
                      <span className="text-xs text-gray-400">FHJ Website</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded bg-blue-500"></div>
                      <span className="text-xs text-gray-400">WordPress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded bg-green-500"></div>
                      <span className="text-xs text-gray-400">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded bg-blue-700"></div>
                      <span className="text-xs text-gray-400">LinkedIn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded bg-sky-400"></div>
                      <span className="text-xs text-gray-400">Twitter</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar View */}
              <div className="xl:col-span-3">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (currentMonth === 0) {
                            setCurrentMonth(11);
                            setCurrentYear(currentYear - 1);
                          } else {
                            setCurrentMonth(currentMonth - 1);
                          }
                        }}
                        className="h-7 w-7 p-0 text-gray-400 hover:text-gray-200"
                      >
                        <ChevronDown className="w-4 h-4 rotate-90" />
                      </Button>
                      <h3 className="text-sm font-semibold text-gray-100">
                        {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (currentMonth === 11) {
                            setCurrentMonth(0);
                            setCurrentYear(currentYear + 1);
                          } else {
                            setCurrentMonth(currentMonth + 1);
                          }
                        }}
                        className="h-7 w-7 p-0 text-gray-400 hover:text-gray-200"
                      >
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setCurrentMonth(new Date().getMonth());
                        setCurrentYear(new Date().getFullYear());
                      }}
                      className="h-7 px-2 text-xs text-gray-400 hover:text-gray-200"
                    >
                      Today
                    </Button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="border border-gray-700 rounded overflow-hidden">
                    {/* Calendar Header */}
                    <div className="grid grid-cols-7 bg-gray-900">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-2 text-center text-xs font-medium text-gray-400">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Body */}
                    <div className="grid grid-cols-7">
                      {(() => {
                        // Get first day of month
                        const firstDay = new Date(currentYear, currentMonth, 1);
                        const lastDay = new Date(currentYear, currentMonth + 1, 0);
                        const prevLastDay = new Date(currentYear, currentMonth, 0);
                        
                        const startDate = firstDay.getDay();
                        const endDate = lastDay.getDate();
                        const prevEndDate = prevLastDay.getDate();
                        
                        const days = [];
                        
                        // Previous month days
                        for (let i = startDate - 1; i >= 0; i--) {
                          days.push({
                            day: prevEndDate - i,
                            isCurrentMonth: false,
                            date: new Date(currentYear, currentMonth - 1, prevEndDate - i)
                          });
                        }
                        
                        // Current month days
                        for (let i = 1; i <= endDate; i++) {
                          days.push({
                            day: i,
                            isCurrentMonth: true,
                            date: new Date(currentYear, currentMonth, i)
                          });
                        }
                        
                        // Next month days
                        const remainingDays = 35 - days.length;
                        for (let i = 1; i <= remainingDays; i++) {
                          days.push({
                            day: i,
                            isCurrentMonth: false,
                            date: new Date(currentYear, currentMonth + 1, i)
                          });
                        }
                        
                        return days.map((dayInfo, i) => {
                          const isToday = 
                            dayInfo.isCurrentMonth &&
                            dayInfo.date.toDateString() === new Date().toDateString();
                          
                          // Find events for this date
                          const dayEvents = calendarEvents.filter(event => {
                            const eventDate = new Date(event.scheduled_date);
                            return eventDate.toDateString() === dayInfo.date.toDateString();
                          });
                          
                          return (
                            <div 
                              key={i} 
                              className={`min-h-[80px] p-1 border-b border-r border-gray-700 cursor-pointer hover:bg-gray-700/50 ${
                                !dayInfo.isCurrentMonth ? 'bg-gray-900/50' : 'bg-gray-800'
                              } ${isToday ? 'bg-blue-900/20' : ''}`}
                              onClick={() => {
                                if (dayInfo.isCurrentMonth) {
                                  setSelectedDate(dayInfo.date);
                                  const dateStr = dayInfo.date.toISOString().slice(0, 16);
                                  setNewEventDate(dateStr);
                                }
                              }}
                            >
                              <div className={`text-xs mb-1 ${
                                !dayInfo.isCurrentMonth ? 'text-gray-600' : 'text-gray-300'
                              } ${isToday ? 'font-bold text-blue-400' : ''}`}>
                                {dayInfo.day}
                              </div>
                              
                              {/* Events */}
                              <div className="space-y-1">
                                {dayEvents.slice(0, 2).map((event, idx) => (
                                  <div
                                    key={idx}
                                    className={`text-xs p-0.5 rounded truncate cursor-pointer ${
                                      event.platform === 'Website' ? 'bg-yellow-600/20 text-yellow-400' :
                                      event.platform === 'WordPress' ? 'bg-blue-600/20 text-blue-400' :
                                      event.platform === 'Medium' ? 'bg-green-600/20 text-green-400' :
                                      event.platform === 'LinkedIn' ? 'bg-blue-700/20 text-blue-400' :
                                      'bg-sky-600/20 text-sky-400'
                                    } ${event.type === 'article' ? 'border border-gray-600' : ''}`}
                                    title={`${event.title} - ${event.platform} ${event.type === 'article' ? '(Article)' : ''}`}
                                  >
                                    {event.type === 'article' && <span className="mr-1">📄</span>}
                                    {event.title}
                                  </div>
                                ))}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    +{dayEvents.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Selected Date Events */}
                  {selectedDate && (
                    <div className="mt-3 p-3 bg-gray-900 border border-gray-700 rounded">
                      <h4 className="text-xs font-semibold mb-2 text-gray-300">
                        Events for {selectedDate.toLocaleDateString()}
                      </h4>
                      <div className="space-y-2">
                        {calendarEvents
                          .filter(event => {
                            const eventDate = new Date(event.scheduled_date);
                            return eventDate.toDateString() === selectedDate.toDateString();
                          })
                          .map((event, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <div>
                                <span className={`inline-block w-2 h-2 rounded mr-2 ${
                                  event.platform === 'WordPress' ? 'bg-blue-500' :
                                  event.platform === 'Medium' ? 'bg-green-500' :
                                  event.platform === 'LinkedIn' ? 'bg-blue-700' :
                                  'bg-sky-400'
                                }`}></span>
                                <span className="text-gray-300">{event.title}</span>
                                <span className="text-gray-500 ml-2">({event.platform})</span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const eventToDelete = calendarEvents.filter(e => {
                                    const eventDate = new Date(e.scheduled_date);
                                    return eventDate.toDateString() === selectedDate.toDateString();
                                  })[idx];
                                  
                                  const updatedEvents = calendarEvents.filter(e => e.id !== eventToDelete.id);
                                  saveCalendarEvents(updatedEvents);
                                }}
                                className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        {calendarEvents.filter(event => {
                          const eventDate = new Date(event.scheduled_date);
                          return eventDate.toDateString() === selectedDate.toDateString();
                        }).length === 0 && (
                          <p className="text-xs text-gray-500">No events scheduled</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                📊 Analytics Dashboard
              </h3>

              {dashboardStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardStats.totalContent}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Total Content
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {dashboardStats.completedThisWeek}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Published This Week
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {dashboardStats.inProgress}
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">
                      In Progress
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      window.open(
                        `${API_BASE_URL}/api/analytics/dashboard`,
                        "_blank"
                      )
                    }
                    variant="outline"
                  >
                    📊 View Full Analytics
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(
                        `${API_BASE_URL}/api/analytics/content-status`,
                        "_blank"
                      )
                    }
                    variant="outline"
                  >
                    📈 Content Status Report
                  </Button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Available Analytics Endpoints:
                  </h4>
                  <div className="space-y-1 text-sm font-mono">
                    <div>
                      📊 <code>GET /api/analytics/dashboard</code> - Full
                      analytics
                    </div>
                    <div>
                      📈 <code>GET /api/analytics/content-status</code> - Status
                      distribution
                    </div>
                    <div>
                      🚀 <code>GET /api/analytics/quick-stats</code> - Quick
                      overview
                    </div>
                    <div>
                      🔔 <code>GET /api/notifications</code> - System
                      notifications
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bulk Image Update Modal */}
        {showBulkImageUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Images to Existing Articles</h3>
                <Button variant="ghost" onClick={() => setShowBulkImageUpdate(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Add featured images to articles that don't have them yet. Paste image URLs from Unsplash, Pixabay, or other sources.
              </p>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {articles
                  .filter(article => !article.image && !article.cover_image)
                  .map((article) => (
                    <Card key={article.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{article.title}</h4>
                          <p className="text-sm text-gray-500">{article.category} • {article.author}</p>
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="https://images.unsplash.com/photo-..."
                            value={bulkImageUpdates[article.id!] || ""}
                            onChange={(e) => setBulkImageUpdates({
                              ...bulkImageUpdates,
                              [article.id!]: e.target.value
                            })}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>

              {articles.filter(article => !article.image && !article.cover_image).length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">All articles already have images! 🎉</p>
                </Card>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowBulkImageUpdate(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBulkImageUpdate}>
                  <Upload className="w-4 h-4 mr-2" />
                  Update Images
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Blog Post Scheduler Modal */}
        {showScheduler && selectedArticleForSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Schedule Post</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowScheduler(false);
                    setSelectedArticleForSchedule(null);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-700 rounded p-3">
                  <h4 className="text-sm font-semibold text-gray-300 mb-1">
                    {selectedArticleForSchedule.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    By {selectedArticleForSchedule.author} • {selectedArticleForSchedule.category}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Schedule Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="h-9 text-sm bg-gray-700 border-gray-600 text-gray-100"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Platform</label>
                    <select
                      className="w-full h-9 px-2 py-1 text-sm border rounded-md bg-gray-700 border-gray-600 text-gray-100"
                      value={newEventPlatform}
                      onChange={(e) => setNewEventPlatform(e.target.value)}
                    >
                      <option value="Website">FHJ Website</option>
                      <option value="WordPress">WordPress</option>
                      <option value="Medium">Medium</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter</option>
                    </select>
                  </div>

                  <div className="bg-gray-900 border border-gray-700 rounded p-3 space-y-2">
                    <h5 className="text-xs font-semibold text-gray-400">Scheduled Posts for this Article:</h5>
                    {calendarEvents
                      .filter(event => event.articleId === selectedArticleForSchedule.id)
                      .map((event, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <div>
                            <span className={`inline-block w-2 h-2 rounded mr-2 ${
                              event.platform === 'Website' ? 'bg-yellow-500' :
                              event.platform === 'WordPress' ? 'bg-blue-500' :
                              event.platform === 'Medium' ? 'bg-green-500' :
                              event.platform === 'LinkedIn' ? 'bg-blue-700' :
                              'bg-sky-400'
                            }`}></span>
                            <span className="text-gray-300">
                              {new Date(event.scheduled_date).toLocaleString()} - {event.platform}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updatedEvents = calendarEvents.filter(e => e.id !== event.id);
                              saveCalendarEvents(updatedEvents);
                            }}
                            className="h-5 w-5 p-0 text-red-400 hover:text-red-300"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    {calendarEvents.filter(event => event.articleId === selectedArticleForSchedule.id).length === 0 && (
                      <p className="text-xs text-gray-500">No scheduled posts for this article</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowScheduler(false);
                      setSelectedArticleForSchedule(null);
                    }}
                    className="flex-1 h-9 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!newEventDate) {
                        alert("Please select a date and time");
                        return;
                      }

                      // If this is a temporary article, save it first
                      let articleId = selectedArticleForSchedule.id;
                      if (selectedArticleForSchedule.id?.startsWith("temp-")) {
                        // Save the article first
                        const articleData = {
                          ...selectedArticleForSchedule,
                          id: undefined, // Remove temp ID
                          status: "scheduled" as const,
                          content_type: "blog_post",
                          priority: "medium",
                          workflow_stage: "scheduled"
                        };
                        
                        try {
                          const response = await fetch(`${API_BASE_URL}/articles`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(articleData),
                          });
                          
                          if (response.ok) {
                            const savedArticle = await response.json();
                            articleId = savedArticle.id || savedArticle._id;
                            
                            // Clear the form
                            setTitle("");
                            setMarkdownContent("");
                            setExcerpt("");
                            setFeaturedImage("");
                            setTags([]);
                            setShowPreview(false);
                            
                            // Reload articles
                            await loadArticles();
                          } else {
                            const errorText = await response.text();
                            console.error("Failed to save article:", response.status, errorText);
                            alert(`Failed to save article before scheduling. Status: ${response.status}`);
                            return;
                          }
                        } catch (error) {
                          console.error("Error saving article:", error);
                          alert("Error saving article");
                          return;
                        }
                      }
                      
                      const newEvent = {
                        id: Date.now().toString(),
                        title: selectedArticleForSchedule.title,
                        scheduled_date: newEventDate,
                        platform: newEventPlatform,
                        type: "article",
                        articleId: articleId,
                        status: "scheduled"
                      };

                      const updatedEvents = [...calendarEvents, newEvent];
                      saveCalendarEvents(updatedEvents);
                      
                      setNewEventDate("");
                      setShowScheduler(false);
                      setSelectedArticleForSchedule(null);
                      alert("Post scheduled successfully!");
                    }}
                    disabled={!newEventDate}
                    className="flex-1 h-9 text-sm bg-blue-600 hover:bg-blue-700"
                  >
                    Schedule Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
