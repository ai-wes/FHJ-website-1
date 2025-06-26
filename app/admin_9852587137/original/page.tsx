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

interface Article {
  id?: string;
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

  // Simple HTML form state
  const [htmlContent, setHtmlContent] = useState("");
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

  // Platform credentials state
  const [credentials, setCredentials] = useState({
    wordpress: { url: "", username: "", password: "" },
    medium: { token: "" },
    linkedin: { token: "" },
    twitter: { apiKey: "", apiSecret: "", accessToken: "", accessTokenSecret: "" }
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const htmlTemplate = `<!-- Article Header Section -->
<div class="article-header">
  <div class="category-badge">
    <span class="category">[CATEGORY_NAME]</span>
  </div>
  <h1 class="article-title">[ARTICLE_TITLE]</h1>
  <p class="article-subtitle">
    [ARTICLE_SUBTITLE_OR_DESCRIPTION]
  </p>
  
  <div class="article-meta">
    <div class="author-info">
      <img src="[AUTHOR_AVATAR_URL]" alt="[AUTHOR_NAME]" class="author-avatar" />
      <div class="author-details">
        <span class="author-name">[AUTHOR_NAME]</span>
        <span class="publish-date">[READING_TIME] min read • [PUBLISH_DATE]</span>
      </div>
    </div>
    <div class="article-tags">
      <span class="tag">[TAG_1]</span>
      <span class="tag">[TAG_2]</span>
      <span class="tag">[TAG_3]</span>
    </div>
  </div>
</div>

<!-- Featured Image -->
<div class="featured-image">
  <img src="[FEATURED_IMAGE_URL]" alt="[FEATURED_IMAGE_ALT_TEXT]" />
  <caption class="image-caption">
    [FEATURED_IMAGE_CAPTION]
  </caption>
</div>

<!-- Article Introduction -->
<div class="article-intro">
  <p class="lead-paragraph">
    [COMPELLING_INTRODUCTION_PARAGRAPH_THAT_HOOKS_READERS_AND_SETS_UP_THE_ARTICLE]
  </p>
</div>

<!-- Main Content Sections -->
<section class="content-section">
  <h2 class="section-heading">[MAIN_SECTION_HEADING]</h2>
  
  <p>
    [MAIN_SECTION_INTRODUCTION_PARAGRAPH_WITH_OVERVIEW]. Use <strong>strong tags</strong> 
    for important terms and <em>emphasis tags</em> for mild emphasis or technical terms.
  </p>

  <h3 class="subsection-heading">[SUBSECTION_HEADING]</h3>
  
  <p>[SUBSECTION_INTRODUCTION_TEXT]:</p>
  
  <ul class="feature-list">
    <li>
      <strong>[FEATURE_POINT_1_TITLE]:</strong> [Detailed description and explanation 
      of the first key point or feature being discussed]
    </li>
    <li>
      <strong>[FEATURE_POINT_2_TITLE]:</strong> [Detailed description and explanation 
      of the second key point or feature being discussed]
    </li>
    <li>
      <strong>[FEATURE_POINT_3_TITLE]:</strong> [Detailed description and explanation 
      of the third key point or feature being discussed]
    </li>
    <li>
      <strong>[FEATURE_POINT_4_TITLE]:</strong> [Detailed description and explanation 
      of the fourth key point or feature being discussed]
    </li>
  </ul>
</section>

<section class="content-section">
  <h2 class="section-heading">[SECOND_MAJOR_SECTION_HEADING]</h2>
  
  <p>
    [INTRODUCTION_TO_SECOND_SECTION_EXPLAINING_THE_TOPIC]
  </p>

  <h3 class="subsection-heading">[TECHNICAL_SUBSECTION_HEADING]</h3>
  
  <p>[EXPLANATION_OF_TECHNICAL_PROCESS_OR_METHODOLOGY]:</p>
  
  <ol class="process-list">
    <li>
      <strong>[STEP_1_TITLE]:</strong> [Detailed explanation of the first step 
      in the process or methodology being described]
    </li>
    <li>
      <strong>[STEP_2_TITLE]:</strong> [Detailed explanation of the second step 
      in the process or methodology being described]
    </li>
    <li>
      <strong>[STEP_3_TITLE]:</strong> [Detailed explanation of the third step 
      in the process or methodology being described]
    </li>
  </ol>

  <div class="highlight-box">
    <blockquote class="expert-quote">
      <p>
        "[EXPERT_QUOTE_OR_KEY_INSIGHT_THAT_SUPPORTS_YOUR_ARTICLE_TOPIC]"
      </p>
      <cite class="quote-attribution">— [EXPERT_NAME], [EXPERT_TITLE_OR_CREDENTIALS]</cite>
    </blockquote>
  </div>

  <h3 class="subsection-heading">[TECHNICAL_DETAILS_SUBSECTION]</h3>
  
  <p>
    [EXPLANATION_OF_TECHNICAL_IMPLEMENTATION_OR_DETAILS]
  </p>

  <div class="code-example">
    <pre><code class="language-[PROGRAMMING_LANGUAGE]">
# [CODE_EXAMPLE_DESCRIPTION]
[YOUR_CODE_EXAMPLE_HERE]

// Add comments to explain key parts
function exampleFunction() {
    // Implementation details
    return result;
}

# Usage example
result = exampleFunction();
    </code></pre>
  </div>
</section>

<section class="content-section">
  <h2 class="section-heading">[CHALLENGES_OR_ANALYSIS_SECTION_HEADING]</h2>
  
  <div class="two-column-layout">
    <div class="column">
      <h3 class="subsection-heading">[LEFT_COLUMN_HEADING]</h3>
      <ul class="challenge-list">
        <li>
          <strong>[CHALLENGE_1_TITLE]:</strong> [Description of the first challenge 
          or consideration in your topic area]
        </li>
        <li>
          <strong>[CHALLENGE_2_TITLE]:</strong> [Description of the second challenge 
          or consideration in your topic area]
        </li>
        <li>
          <strong>[CHALLENGE_3_TITLE]:</strong> [Description of the third challenge 
          or consideration in your topic area]
        </li>
        <li>
          <strong>[CHALLENGE_4_TITLE]:</strong> [Description of the fourth challenge 
          or consideration in your topic area]
        </li>
      </ul>
    </div>
    
    <div class="column">
      <h3 class="subsection-heading">[RIGHT_COLUMN_HEADING]</h3>
      <ul class="ethics-list">
        <li>
          <strong>[CONSIDERATION_1_TITLE]:</strong> [Description of the first consideration 
          or implication of your topic]
        </li>
        <li>
          <strong>[CONSIDERATION_2_TITLE]:</strong> [Description of the second consideration 
          or implication of your topic]
        </li>
        <li>
          <strong>[CONSIDERATION_3_TITLE]:</strong> [Description of the third consideration 
          or implication of your topic]
        </li>
        <li>
          <strong>[CONSIDERATION_4_TITLE]:</strong> [Description of the fourth consideration 
          or implication of your topic]
        </li>
      </ul>
    </div>
  </div>

  <div class="callout-box">
    <h4 class="callout-heading">[CALLOUT_BOX_HEADING]</h4>
    <p>
      [IMPORTANT_INSIGHT_OR_KEY_TAKEAWAY_THAT_DESERVES_SPECIAL_ATTENTION_IN_YOUR_ARTICLE]
    </p>
  </div>
</section>

<section class="content-section">
  <h2 class="section-heading">[FUTURE_OUTLOOK_SECTION_HEADING]</h2>
  
  <h3 class="subsection-heading">[FUTURE_DEVELOPMENTS_SUBSECTION]</h3>
  
  <p>
    [DESCRIPTION_OF_FUTURE_POSSIBILITIES_OR_DEVELOPMENTS_IN_YOUR_TOPIC_AREA]
  </p>
  
  <div class="feature-grid">
    <div class="feature-card">
      <h4 class="feature-title">[FUTURE_FEATURE_1_TITLE]</h4>
      <p>[Description of the first future possibility or development]</p>
    </div>
    
    <div class="feature-card">
      <h4 class="feature-title">[FUTURE_FEATURE_2_TITLE]</h4>
      <p>[Description of the second future possibility or development]</p>
    </div>
    
    <div class="feature-card">
      <h4 class="feature-title">[FUTURE_FEATURE_3_TITLE]</h4>
      <p>[Description of the third future possibility or development]</p>
    </div>
    
    <div class="feature-card">
      <h4 class="feature-title">[FUTURE_FEATURE_4_TITLE]</h4>
      <p>[Description of the fourth future possibility or development]</p>
    </div>
  </div>

  <h3 class="subsection-heading">[IMPLEMENTATION_OR_ADOPTION_SUBSECTION]</h3>
  
  <p>
    [DISCUSSION_OF_HOW_THESE_DEVELOPMENTS_MIGHT_BE_IMPLEMENTED_OR_ADOPTED]
  </p>
</section>

<!-- Conclusion Section -->
<section class="conclusion-section">
  <h2 class="section-heading">[CONCLUSION_SECTION_HEADING]</h2>
  
  <p class="conclusion-paragraph">
    [MAIN_CONCLUSION_PARAGRAPH_THAT_SUMMARIZES_THE_KEY_POINTS_OF_YOUR_ARTICLE]
  </p>
  
  <p>
    [SECOND_CONCLUSION_PARAGRAPH_THAT_DISCUSSES_BROADER_IMPLICATIONS_OR_SIGNIFICANCE]
  </p>
  
  <p>
    [FINAL_CONCLUSION_PARAGRAPH_THAT_PROVIDES_ACTIONABLE_INSIGHTS_OR_CALL_TO_REFLECTION]
  </p>

  <div class="call-to-action">
    <h3 class="cta-heading">[CALL_TO_ACTION_HEADING]</h3>
    <p>
      [ENGAGING_QUESTION_OR_STATEMENT_THAT_ENCOURAGES_READER_PARTICIPATION_OR_FURTHER_THOUGHT]
    </p>
  </div>
</section>

<!-- Related Content -->
<section class="related-content">
  <h3 class="related-heading">Related Articles</h3>
  <div class="related-grid">
    <a href="[RELATED_ARTICLE_1_URL]" class="related-link">
      <div class="related-card">
        <h4>[RELATED_ARTICLE_1_TITLE]</h4>
        <p>[Related article 1 description or excerpt]</p>
      </div>
    </a>
    <a href="[RELATED_ARTICLE_2_URL]" class="related-link">
      <div class="related-card">
        <h4>[RELATED_ARTICLE_2_TITLE]</h4>
        <p>[Related article 2 description or excerpt]</p>
      </div>
    </a>
  </div>
</section>`;

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(htmlTemplate);
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

  const loadCalendarEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/calendar/events`);
      if (response.ok) {
        const data = await response.json();
        setCalendarEvents(data);
      }
    } catch (error) {
      console.error("Error loading calendar events:", error);
    }
  };

  const handleAddCalendarEvent = async () => {
    if (!newEventTitle || !newEventDate) {
      alert("Please provide event title and date");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/calendar/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEventTitle,
          scheduled_date: newEventDate,
          platform: newEventPlatform,
          type: "scheduled_post"
        })
      });

      if (response.ok) {
        await loadCalendarEvents();
        setNewEventTitle("");
        setNewEventDate("");
        alert("Event added successfully!");
      } else {
        alert("Failed to add event");
      }
    } catch (error) {
      console.error("Error adding calendar event:", error);
      alert("Error adding event");
    }
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

  const handlePostArticle = async () => {
    if (!title || !htmlContent) {
      alert("Please provide both title and content");
      return;
    }

    setIsPosting(true);
    try {
      const articleData: Article = {
        slug: generateSlug(title),
        title: title,
        excerpt: excerpt,
        content: htmlContent,
        cover_image: featuredImage || "/images/default-blog.jpg", // Add featured image
        category: category,
        author: author,
        date: new Date().toISOString().split("T")[0],
        reading_time: estimateReadingTime(htmlContent),
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
        setHtmlContent("");
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
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadArticles();
      } else {
        console.error("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Content Management Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your articles, research content, and publishing workflow.
          </p>
        </div>

        {/* Dashboard Stats */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="text-2xl font-bold">
                {dashboardStats.totalContent || 0}
              </div>
              <div className="text-sm opacity-90">Total Articles</div>
            </Card>
            <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="text-2xl font-bold">
                {dashboardStats.drafts || 0}
              </div>
              <div className="text-sm opacity-90">Drafts</div>
            </Card>
            <Card className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="text-2xl font-bold">
                {dashboardStats.scheduled || 0}
              </div>
              <div className="text-sm opacity-90">Scheduled</div>
            </Card>
            <Card className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="text-2xl font-bold">
                {dashboardStats.dueSoon || 0}
              </div>
              <div className="text-sm opacity-90">Due Soon</div>
            </Card>
          </div>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">🔔 Notifications</h3>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((notification, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    notification.type === "warning"
                      ? "bg-yellow-50 border-yellow-400"
                      : notification.type === "error"
                      ? "bg-red-50 border-red-400"
                      : "bg-blue-50 border-blue-400"
                  }`}
                >
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-gray-600">
                    {notification.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="create">
              <Plus className="w-4 h-4 mr-2" />
              Create Article
            </TabsTrigger>
            <TabsTrigger value="manage">
              <FileText className="w-4 h-4 mr-2" />
              Content Manager
            </TabsTrigger>
            <TabsTrigger value="multi-platform">
              <Upload className="w-4 h-4 mr-2" />
              Multi-Platform
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="w-4 h-4 mr-2" />
              Content Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          </TabsList>


          <TabsContent value="create" className="space-y-6">
            {/* Simple HTML Article Creator */}
            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <Plus className="w-5 h-5" />
                Create New Article
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Input
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                  <select
                    className="px-3 py-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Biotechnology">Biotechnology</option>
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
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Featured Image</label>
                  <Input
                    placeholder="Image URL (e.g., https://example.com/image.jpg)"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                  />
                  {featuredImage && (
                    <div className="mt-2">
                      <img 
                        src={featuredImage} 
                        alt="Featured image preview" 
                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Add a featured image URL. This will be displayed on the articles page and as the main image for your article.
                  </p>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    💡 <strong>Tip:</strong> Try these free image sources:
                    <br />• <a href="https://unsplash.com" target="_blank" className="underline">Unsplash</a> - High-quality free photos
                    <br />• <a href="https://pixabay.com" target="_blank" className="underline">Pixabay</a> - Free images & vectors
                    <br />• <a href="https://pexels.com" target="_blank" className="underline">Pexels</a> - Free stock photos
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <TagInput
                    tags={tags}
                    onTagsChange={setTags}
                    placeholder="Enter tags and press Enter"
                  />
                  <p className="text-xs text-gray-500">
                    Add relevant tags to help categorize your article
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">HTML Content</label>
                  
                  {/* HTML Template Accordion */}
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowTemplate(!showTemplate)}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          HTML Template Reference
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyTemplate();
                          }}
                          className="text-xs"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform ${
                            showTemplate ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>
                    
                    {showTemplate && (
                      <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Template for article formatting:
                          </span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 max-h-60 overflow-y-auto">
                          <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                            {htmlTemplate}
                          </pre>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Use this structure for consistent article formatting. Click "Copy" to copy the template.
                        </p>
                      </div>
                    )}
                  </Card>
                  
                  <Textarea
                    placeholder="Paste your HTML content here..."
                    className="min-h-[400px] font-mono text-sm"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Paste your HTML content directly. Use the template above for reference.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    disabled={!htmlContent}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                  <Button
                    onClick={handlePostArticle}
                    disabled={!title || !htmlContent || isPosting}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isPosting ? "Posting..." : "Post Article"}
                  </Button>
                </div>

                {showPreview && htmlContent && (
                  <Card className="p-6 mt-4 bg-gray-50 dark:bg-gray-900">
                    <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
                      Preview:
                    </h4>
                    <div
                      className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-code:text-primary prose-pre:bg-muted prose-img:rounded-lg prose-img:shadow-md"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  </Card>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {/* Existing Articles */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Content Manager Dashboard ({articles.length})
                </h3>
                <Button onClick={loadArticles} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button size="sm" onClick={() => setActiveTab("create")}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Content
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowBulkImageUpdate(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Add Images
                </Button>
              </div>

              {articles.length === 0 ? (
                <Card className="p-8 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-600 dark:text-gray-300">
                    No articles found. Create your first article above!
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {articles.map((article) => (
                    <Card
                      key={article.id}
                      className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm"
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
                              <option value="Biotechnology">
                                Biotechnology
                              </option>
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
                              Article Content (HTML)
                            </label>
                            <Textarea
                              value={editingArticle.content}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  content: e.target.value,
                                })
                              }
                              placeholder="Edit your HTML content..."
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
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {article.title}
                              </h3>
                              <Badge
                                variant={
                                  article.status === "published"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {article.status}
                              </Badge>
                              {article.featured && (
                                <Badge variant="outline">Featured</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex gap-2 mb-2 flex-wrap">
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Tag className="w-3 h-3" />
                                {article.category}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                <Calendar className="w-3 h-3" />
                                {new Date(article.date).toLocaleDateString()}
                              </Badge>
                              {article.reading_time && (
                                <Badge variant="secondary">
                                  {article.reading_time}
                                </Badge>
                              )}
                            </div>
                            {article.tags && article.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap mb-2">
                                {article.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              By {article.author || "Unknown"} • Slug: /
                              {article.slug}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(
                                  `/articles/${article.slug}`,
                                  "_blank"
                                )
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingArticle(article)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {article.status === "draft" && (
                              <Button
                                size="sm"
                                onClick={() => handlePublishArticle(article)}
                              >
                                <Upload className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteArticle(article.id!)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
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

          <TabsContent value="calendar" className="space-y-6">
            {/* Enhanced Content Calendar */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Calendar Controls */}
              <div className="xl:col-span-1">
                <Card className="p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm mb-4">
                  <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
                    Add New Event
                  </h4>
                  <div className="space-y-3">
                    <Input 
                      placeholder="Event Title" 
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                    />
                    <Input 
                      type="datetime-local" 
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                    />
                    <select 
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      value={newEventPlatform}
                      onChange={(e) => setNewEventPlatform(e.target.value)}
                    >
                      <option value="WordPress">WordPress</option>
                      <option value="Medium">Medium</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter</option>
                    </select>
                    <Button 
                      className="w-full"
                      onClick={handleAddCalendarEvent}
                      disabled={!newEventTitle || !newEventDate}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                </Card>

                {/* Platform Legend */}
                <Card className="p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                  <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
                    Platform Legend
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-500"></div>
                      <span className="text-sm">WordPress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-sm">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-700"></div>
                      <span className="text-sm">LinkedIn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-sky-400"></div>
                      <span className="text-sm">Twitter</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Calendar View */}
              <div className="xl:col-span-3">
                <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Content Publishing Calendar
                    </h3>
                    <div className="flex gap-2">
                      <Button 
                        variant={calendarView === "month" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setCalendarView("month")}
                      >
                        Month
                      </Button>
                      <Button 
                        variant={calendarView === "week" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setCalendarView("week")}
                      >
                        Week
                      </Button>
                      <Button 
                        variant={calendarView === "day" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setCalendarView("day")}
                      >
                        Day
                      </Button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {/* Calendar Header */}
                    <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Body */}
                    <div className="grid grid-cols-7">
                      {Array.from({ length: 35 }, (_, i) => {
                        const dayNumber = i - 5; // Start from 26th of previous month
                        const isCurrentMonth = dayNumber > 0 && dayNumber <= 31;
                        const isToday = dayNumber === new Date().getDate() && isCurrentMonth;
                        
                        return (
                          <div 
                            key={i} 
                            className={`min-h-[100px] p-2 border-b border-r border-gray-200 dark:border-gray-700 ${
                              !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'
                            } ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                          >
                            <div className={`text-sm mb-1 ${
                              !isCurrentMonth ? 'text-gray-400' : 'text-gray-900 dark:text-white'
                            } ${isToday ? 'font-bold text-blue-600' : ''}`}>
                              {isCurrentMonth ? dayNumber : dayNumber <= 0 ? 31 + dayNumber : dayNumber - 31}
                            </div>
                            
                            {/* Sample Events */}
                            {isCurrentMonth && dayNumber % 7 === 1 && (
                              <div className="space-y-1">
                                <div className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate">
                                  WordPress Post
                                </div>
                              </div>
                            )}
                            {isCurrentMonth && dayNumber % 7 === 3 && (
                              <div className="space-y-1">
                                <div className="text-xs p-1 bg-green-100 text-green-800 rounded truncate">
                                  Medium Article
                                </div>
                              </div>
                            )}
                            {isCurrentMonth && dayNumber % 7 === 5 && (
                              <div className="space-y-1">
                                <div className="text-xs p-1 bg-sky-100 text-sky-800 rounded truncate">
                                  Twitter Thread
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Calendar Footer */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Click on any date to add new content or manage existing events
                    </p>
                  </div>
                </Card>
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
      </div>
    </div>
  );
}
