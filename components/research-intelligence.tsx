"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  TrendingUp,
  ExternalLink,
  Calendar,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  RefreshCw,
  BarChart3,
  Newspaper,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ResearchRequest {
  query: string;
  model: string;
  api_key?: string;
}

interface ResearchResponse {
  status: "success" | "error";
  data?: {
    query: string;
    model: string;
    summary: string;
    sources: Array<
      | {
          title?: string;
          url?: string;
          outlet?: string;
          date?: string;
        }
      | string
    >;
    raw_response: string;
    generated_at: string;
  };
  error?: string;
  raw_response?: any;
}

interface SystemStatus {
  status: string;
  research_available: boolean;
  autoblogging_available: boolean;
  message: string;
}

interface ResearchStatus {
  status: string;
  research_available: boolean;
  config_status: string;
  config_message: string;
  supported_models: string[];
}

export function ResearchIntelligence() {
  const [query, setQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("sonar-pro");
  const [isResearching, setIsResearching] = useState(false);
  const [researchResults, setResearchResults] = useState<
    ResearchResponse["data"] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [researchStatus, setResearchStatus] = useState<ResearchStatus | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("research");

  // Check system status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [systemResponse, researchResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/system-status`),
          fetch(`${API_BASE_URL}/api/research-status`),
        ]);

        const systemData = await systemResponse.json();
        const researchData = await researchResponse.json();

        setSystemStatus(systemData);
        setResearchStatus(researchData);
      } catch (error) {
        console.error("Failed to check system status:", error);
        setSystemStatus({
          status: "offline",
          research_available: false,
          autoblogging_available: false,
          message: "Cannot connect to backend service",
        });
      }
    };

    checkStatus();
  }, []);

  const handleResearch = async () => {
    if (!query.trim()) {
      setError("Research query is required");
      return;
    }

    // Check system status before researching
    if (systemStatus && !systemStatus.research_available) {
      setError(
        "Research service is not available. Please check that the Flask backend is running and the research system is properly configured."
      );
      return;
    }

    setIsResearching(true);
    setError(null);
    setResearchResults(null);

    try {
      const requestData: ResearchRequest = {
        query: query.trim(),
        model: selectedModel,
      };

      const response = await fetch(`${API_BASE_URL}/api/research-topic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result: ResearchResponse = await response.json();

      if (result.status === "success" && result.data) {
        setResearchResults(result.data);
        setActiveTab("results");
      } else {
        setError(result.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error researching topic:", error);
      setError("Failed to connect to research service");
    } finally {
      setIsResearching(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusBadge = (available: boolean) => {
    return (
      <Badge variant={available ? "default" : "destructive"}>
        {available ? "Online" : "Offline"}
      </Badge>
    );
  };

  const formatSource = (source: any, index: number) => {
    if (typeof source === "string") {
      return (
        <div
          key={index}
          className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
        >
          <ExternalLink className="w-4 h-4 mt-1 text-muted-foreground" />
          <div className="flex-1">
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
            >
              {source}
            </a>
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
      >
        <Newspaper className="w-4 h-4 mt-1 text-muted-foreground" />
        <div className="flex-1">
          <div className="font-medium">
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {source.title || source.url}
              </a>
            ) : (
              source.title || "Untitled Source"
            )}
          </div>
          {(source.outlet || source.date) && (
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              {source.outlet && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {source.outlet}
                </span>
              )}
              {source.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {source.date}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Research System Status
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {systemStatus ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Research Service</span>
              {getStatusBadge(systemStatus.research_available)}
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Autoblogging Service</span>
              {getStatusBadge(systemStatus.autoblogging_available)}
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Overall Status</span>
              {getStatusBadge(systemStatus.status === "online")}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading system status...
          </div>
        )}

        {researchStatus && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-sm">
              <strong>Configuration:</strong> {researchStatus.config_status} -{" "}
              {researchStatus.config_message}
            </div>
            <div className="text-sm mt-1">
              <strong>Supported Models:</strong>{" "}
              {researchStatus.supported_models.join(", ")}
            </div>
          </div>
        )}
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="research">
            <Search className="w-4 h-4 mr-2" />
            Research
          </TabsTrigger>
          <TabsTrigger value="results">
            <TrendingUp className="w-4 h-4 mr-2" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Content Intelligence Research
            </h3>
            <p className="text-muted-foreground mb-6">
              Research trending topics, news, and insights from media outlets
              and platforms to inform your content creation strategy.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Input
                    placeholder="Enter research topic (e.g., 'Latest AI trends 2024', 'Sustainable technology news')"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !isResearching) {
                        handleResearch();
                      }
                    }}
                  />
                </div>
                <div>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    <option value="sonar-pro">Sonar Pro</option>
                    <option value="sonar">Sonar</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleResearch}
                  disabled={isResearching || !query.trim()}
                  className="flex-1 md:flex-none"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Research Topic
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <div className="font-medium text-destructive">
                      Research Failed
                    </div>
                    <div className="text-sm text-destructive/80 mt-1">
                      {error}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Example Queries */}
          <Card className="p-6">
            <h4 className="font-semibold mb-3">Example Research Queries</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Latest AI breakthroughs 2024",
                "Sustainable technology trends",
                "Cybersecurity news this week",
                "Blockchain adoption in finance",
                "Remote work technology tools",
                "Climate tech innovations",
              ].map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto p-3"
                  onClick={() => setQuery(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {researchResults ? (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Research Summary
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCopyToClipboard(researchResults.summary)
                    }
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div className="prose max-w-none">
                  <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                    {researchResults.summary}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>Query: "{researchResults.query}"</span>
                  <span>•</span>
                  <span>Model: {researchResults.model}</span>
                  <span>•</span>
                  <span>
                    Generated:{" "}
                    {new Date(researchResults.generated_at).toLocaleString()}
                  </span>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Sources ({researchResults.sources.length})
                </h3>

                <div className="space-y-3">
                  {researchResults.sources.map((source, index) =>
                    formatSource(source, index)
                  )}
                </div>
              </Card>

              {/* Integration with Blog Generation */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Use Research for Blog Generation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Use these research insights to inform your blog post
                  generation in the Articles tab.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // This would navigate to the articles tab and pre-fill with research
                      const researchInsights = `Based on recent research: ${researchResults.summary.substring(
                        0,
                        200
                      )}...`;
                      // You could emit an event or use a context to pass this data
                      console.log(
                        "Research insights for blog generation:",
                        researchInsights
                      );
                    }}
                  >
                    Use for Article Creation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleCopyToClipboard(researchResults.summary)
                    }
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Summary
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-6">
              <div className="text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>
                  No research results yet. Start by researching a topic in the
                  Research tab.
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
