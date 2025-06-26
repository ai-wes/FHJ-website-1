"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./dashboard.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Navigation tabs
const tabs = [
  { id: "content-manager", label: "Content Manager", icon: "📋" },
  { id: "content-creation", label: "Content Creation", icon: "✏️" },
  { id: "multi-platform", label: "Multi-Platform Posting", icon: "📱" },
  { id: "calendar", label: "Content Posting Calendar", icon: "📅" },
  { id: "analytics", label: "Reports", icon: "📊" }
];

export default function SimpleDashboard() {
  const [activeTab, setActiveTab] = useState("content-manager");
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load articles
      const articlesRes = await fetch(`${API_BASE_URL}/articles`);
      if (articlesRes.ok) {
        const data = await articlesRes.json();
        setArticles(data.articles || []);
      }

      // Load stats
      const statsRes = await fetch(`${API_BASE_URL}/api/analytics/quick-stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Navigation Header */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <img src="/FHJ_mini_logo.png" alt="FHJ" className="nav-logo" />
          <span className="nav-title">Future Human Journal</span>
        </div>
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-content">
        {activeTab === "content-manager" && (
          <div className="content-manager-panel">
            <div className="panel-header">
              <h2>Content Manager Dashboard</h2>
              <div className="header-actions">
                <button className="btn btn-outline">🔽 Filter</button>
                <button className="btn btn-outline">📥 Export</button>
                <Link href="/admin_9852587137/original">
                  <button className="btn btn-primary">➕ New Content</button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            {stats && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{stats.totalContent || 0}</div>
                  <div className="stat-label">Total Content</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.drafts || 0}</div>
                  <div className="stat-label">Drafts</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.scheduled || 0}</div>
                  <div className="stat-label">Scheduled</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.dueSoon || 0}</div>
                  <div className="stat-label">Due Soon</div>
                </div>
              </div>
            )}

            {/* Content Table */}
            <div className="content-table-container">
              {loading ? (
                <div className="loading">Loading content...</div>
              ) : articles.length === 0 ? (
                <div className="empty-state">
                  <p>No content items found</p>
                  <Link href="/admin_9852587137/original">
                    <button className="btn btn-primary">Create First Content</button>
                  </Link>
                </div>
              ) : (
                <table className="content-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article.id}>
                        <td>
                          <span className={`status-badge status-${article.status}`}>
                            {article.status}
                          </span>
                        </td>
                        <td>{article.title}</td>
                        <td>{article.category}</td>
                        <td>{article.author || "Unknown"}</td>
                        <td>{new Date(article.date).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <Link href={`/articles/${article.slug}`} target="_blank">
                              <button className="btn-icon">👁️</button>
                            </Link>
                            <Link href="/admin_9852587137/original">
                              <button className="btn-icon">✏️</button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        
        {activeTab === "content-creation" && (
          <div className="content-panel">
            <h2>AI Content Creation</h2>
            <p>Connect to your AI agents for automated content generation.</p>
            <Link href="/admin_9852587137/original">
              <button className="btn btn-primary">Create Content</button>
            </Link>
          </div>
        )}
        
        {activeTab === "multi-platform" && (
          <div className="content-panel">
            <h2>Multi-Platform Posting</h2>
            <p>Publish your content to multiple platforms simultaneously.</p>
            <div className="platform-list">
              <div className="platform-card">
                <h3>WordPress</h3>
                <button className="btn btn-outline">Configure</button>
              </div>
              <div className="platform-card">
                <h3>Medium</h3>
                <button className="btn btn-outline">Configure</button>
              </div>
              <div className="platform-card">
                <h3>LinkedIn</h3>
                <button className="btn btn-outline">Configure</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "calendar" && (
          <div className="content-panel">
            <h2>Content Calendar</h2>
            <p>Schedule and manage your content publishing timeline.</p>
            <div className="calendar-placeholder">
              <p>Calendar view coming soon!</p>
            </div>
          </div>
        )}
        
        {activeTab === "analytics" && (
          <div className="content-panel">
            <h2>Analytics & Reports</h2>
            <div className="analytics-links">
              <a href={`${API_BASE_URL}/api/analytics/dashboard`} target="_blank">
                <button className="btn btn-outline">📊 View Full Analytics</button>
              </a>
              <a href={`${API_BASE_URL}/api/analytics/content-status`} target="_blank">
                <button className="btn btn-outline">📈 Content Status Report</button>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}