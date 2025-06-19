import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Autocomplete,
} from "@mui/material";
import {
  FilterList,
  GetApp,
  Add,
  Refresh,
  Search,
  MoreVert,
} from "@mui/icons-material";
// Use environment variable or fallback to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
import MuiAlert from "@mui/material/Alert";

const api = {
  async getContent(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/content?${queryString}`);

      if (response.status === 404) {
        // Return empty array instead of throwing
        return [];
      }

      if (!response.ok) {
        console.warn(`API warning: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("API warning:", error);
      return []; // Return empty array instead of throwing
    }
  },

  async createContent(contentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/content/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create content");
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async createMultipleContent(contentItems) {
    const response = await fetch(`${API_BASE_URL}/content/batch-create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: contentItems }),
    });

    if (!response.ok) throw new Error("Failed to create content items");
    return response.json();
  },

  async updateContent(id, data) {
    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update content");
    return response.json();
  },

  async getAnalytics() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/content-status`);

      if (response.status === 404) {
        // No analytics data - return empty object
        return {};
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error("Analytics Error:", error);
      throw new Error(`Failed to fetch analytics: ${error.message}`);
    }
  },

  async getQuickStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/quick-stats`);
      if (!response.ok) return {};
      return response.json();
    } catch (error) {
      console.warn("Quick stats error:", error);
      return {};
    }
  },

  async getNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      if (!response.ok) return [];
      return response.json();
    } catch (error) {
      console.warn("Notifications error:", error);
      return [];
    }
  },
};

const ContentManagerDashboard = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: null,
    content_type: null,
    priority: null,
  });
  const [analytics, setAnalytics] = useState(null);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openNewContentDialog, setOpenNewContentDialog] = useState(false);
  const [newContentData, setNewContentData] = useState({
    title: "",
    description: "",
    client_id: "",
    campaign_id: "",
    content_type: "blog_post",
    priority: "medium",
    status: "draft",
    due_date: new Date().toISOString().split("T")[0],
    assignee_id: "",
    date_received: new Date().toISOString().split("T")[0],
  });
  const [successMessage, setSuccessMessage] = useState(false);
  const [quickStats, setQuickStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [suggestions, setSuggestions] = useState({
    clients: [],
    campaigns: [],
    assignees: [],
    tags: [],
    recent_content_types: [],
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const CONTENT_TYPES = [
    "blog_post",
    "social_media",
    "email",
    "video",
    "infographic",
    "whitepaper",
    "case_study",
    "newsletter",
    "press_release",
    "website_copy",
  ];

  const PRIORITY_LEVELS = ["low", "medium", "high", "urgent"];

  const STATUS_OPTIONS = [
    "draft",
    "in_review",
    "approved",
    "published",
    "archived",
    "rejected",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add query parameters only if they have values
        const queryParams = {};
        if (filters.status) queryParams.status = filters.status;
        if (filters.content_type)
          queryParams.content_type = filters.content_type;
        if (filters.priority) queryParams.priority = filters.priority;

        // Fetch content data
        const contentData = await api.getContent(queryParams);
        setContent(contentData || []);

        // Fetch analytics data
        try {
          const analyticsData = await api.getAnalytics();
          setAnalytics(analyticsData || {});
        } catch (analyticsError) {
          console.warn("Analytics data unavailable:", analyticsError);
          setAnalytics({});
        }

        // Add these new fetch calls
        try {
          const [statsData, notificationsData] = await Promise.all([
            api.getQuickStats(),
            api.getNotifications(),
          ]);
          setQuickStats(statsData);
          setNotifications(notificationsData);
        } catch (error) {
          console.warn("Failed to fetch sidebar data:", error);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load content data. Please try again later.");
        setContent([]);
        setAnalytics({});
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleCompletionToggle = async (id, currentCompleted) => {
    try {
      await api.updateContent(id, { completed: !currentCompleted });
      const updatedContent = content.map((item) =>
        item.id === id ? { ...item, completed: !currentCompleted } : item
      );
      setContent(updatedContent);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredContent = content
    .filter((item) => {
      if (!searchQuery) return true;
      const searchTerm = searchQuery.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm) ||
        item.client_id?.toLowerCase().includes(searchTerm) ||
        item.campaign_id?.toLowerCase().includes(searchTerm)
      );
    })
    .filter((item) => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.content_type && item.content_type !== filters.content_type)
        return false;
      if (filters.priority && item.priority !== filters.priority) return false;

      switch (currentTab) {
        case "draft":
          return item.status === "Draft";
        case "in_review":
          return item.status === "In Review";
        case "published":
          return item.status === "Published";
        default:
          return true;
      }
    });

  const getPriorityChip = (priority) => {
    if (!priority) return null;

    const colors = {
      urgent: "error",
      high: "error",
      medium: "warning",
      low: "success",
    };

    const color = colors[priority.toLowerCase()] || "default";

    return <Chip label={priority.toUpperCase()} color={color} size="small" />;
  };

  const getStatusChip = (status) => {
    if (!status) return null;

    const colors = {
      draft: "default",
      in_review: "primary",
      approved: "success",
      published: "secondary",
      rejected: "error",
      archived: "warning",
    };

    const color = colors[status.toLowerCase()] || "default";

    return <Chip label={status.toUpperCase()} color={color} size="small" />;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCreateContent = async () => {
    try {
      const formattedData = {
        ...newContentData,
        tags: [],
        attachments: [],
        due_date: new Date(newContentData.due_date).toISOString(),
      };

      const response = await api.createContent(formattedData);

      const newItem = response.data || response;

      setContent((prev) => [...prev, newItem]);
      setError(null);
      handleCloseNewContent();
      setSuccessMessage(true);
    } catch (err) {
      console.error("Content creation error:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Failed to create content. Please try again.";
      setError(errorMessage);
    }
  };

  const handleOpenNewContent = async () => {
    setOpenNewContentDialog(true);
    await fetchSuggestions();
  };

  const handleCloseNewContent = () => {
    setOpenNewContentDialog(false);
    setNewContentData({
      title: "",
      description: "",
      client_id: "",
      campaign_id: "",
      content_type: "blog_post",
      priority: "medium",
      status: "draft",
      due_date: new Date().toISOString().split("T")[0],
      assignee_id: "",
      date_received: new Date().toISOString().split("T")[0],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={12} align="center" sx={{ py: 3 }}>
        <Box sx={{ maxWidth: 400, mx: "auto", textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            No content items found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get started by creating your first content item
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateContent}
          >
            Create First Content Item
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );

  const handleCloseSuccessMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessMessage(false);
  };

  const RightSidebar = () => (
    <Box sx={{ width: 300, ml: 2 }}>
      {/* Quick Stats Cards */}
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Quick Facts" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography variant="h4" color="primary">
                  {quickStats.totalContent || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Content
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography variant="h4" color="error">
                  {quickStats.dueSoon || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due Soon
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography variant="h4" color="success.main">
                  {quickStats.completedThisWeek || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed This Week
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography variant="h4" color="warning.main">
                  {quickStats.inProgress || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Notifications Card */}
      <Card>
        <CardHeader
          title="Notifications"
          action={
            <Button size="small" color="primary">
              View All
            </Button>
          }
        />
        <CardContent>
          {notifications.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No new notifications
            </Typography>
          ) : (
            notifications.slice(0, 5).map((notification, index) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: "action.hover",
                  "&:last-child": { mb: 0 },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.timestamp}
                </Typography>
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/suggestions`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.warn("Failed to fetch suggestions:", error);
    }
  };

  const fetchClientCampaigns = async (clientId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/campaigns/by-client/${clientId}`
      );
      if (response.ok) {
        const data = await response.json();
        setAvailableCampaigns(data);
      }
    } catch (error) {
      console.warn("Failed to fetch client campaigns:", error);
    }
  };

  const handleClientChange = async (event) => {
    const clientId = event.target.value;
    setSelectedClient(clientId);
    setNewContentData((prev) => ({
      ...prev,
      client_id: clientId,
      campaign_id: "", // Reset campaign when client changes
    }));
    await fetchClientCampaigns(clientId);
  };

  if (error) {
    return (
      <Card sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
        <Alert
          severity="warning"
          sx={{
            mb: 2,
            backgroundColor: "warning.lighter",
            color: "warning.dark",
            "& .MuiAlert-icon": {
              color: "warning.main",
            },
          }}
          action={
            <Button
              color="warning"
              size="small"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          This could be because:
          <ul>
            <li>The server is not running or unreachable</li>
            <li>There's a network connectivity issue</li>
            <li>The database is empty or unavailable</li>
          </ul>
          Please check your connection and try again.
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ display: "flex", maxWidth: 1700, mx: "auto" }}>
      <Card sx={{ flex: 1 }}>
        <CardHeader
          title={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">Content Manager Dashboard</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FilterList />}
                >
                  Filter
                </Button>
                <Button variant="outlined" size="small" startIcon={<GetApp />}>
                  Export
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  onClick={handleOpenNewContent}
                >
                  New Content
                </Button>
              </Box>
            </Box>
          }
        />

        <CardContent>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ color: "text.secondary", mr: 1 }} />
                ),
              }}
              size="small"
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<Refresh />}
              onClick={() => setFilters({})}
            >
              Reset Filters
            </Button>
          </Box>

          {analytics && Object.keys(analytics).length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {Object.entries(analytics).map(([status, count]) => (
                <Grid item xs={3} key={status}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" variant="body2">
                        {status}
                      </Typography>
                      <Typography variant="h4">{count}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert
              severity="info"
              sx={{
                mb: 3,
                backgroundColor: "info.lighter",
                color: "info.dark",
                "& .MuiAlert-icon": {
                  color: "info.main",
                },
              }}
            >
              No analytics data available yet. Create some content to see
              statistics.
            </Alert>
          )}

          <Tabs
            value={currentTab}
            onChange={(e, val) => setCurrentTab(val)}
            sx={{ mb: 2 }}
          >
            <Tab value="all" label="All Content" />
            <Tab value="draft" label="Drafts" />
            <Tab value="in_review" label="In Review" />
            <Tab value="published" label="Published" />
          </Tabs>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Campaign</TableCell>
                  <TableCell>Content Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Received</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Published</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : content.length === 0 ? (
                  renderEmptyState()
                ) : (
                  filteredContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() =>
                              handleCompletionToggle(item.id, item.completed)
                            }
                          />
                          {item.status ? getStatusChip(item.status) : "-"}
                        </Box>
                      </TableCell>
                      <TableCell>{item.client_id}</TableCell>
                      <TableCell>{item.campaign_id}</TableCell>
                      <TableCell>{item.content_type}</TableCell>
                      <TableCell>
                        <Typography
                          noWrap
                          sx={{ maxWidth: 200 }}
                          title={item.description}
                        >
                          {item.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {item.priority ? getPriorityChip(item.priority) : "-"}
                      </TableCell>
                      <TableCell>{formatDate(item.date_received)}</TableCell>
                      <TableCell>{formatDate(item.due_date)}</TableCell>
                      <TableCell>{formatDate(item.date_submitted)}</TableCell>
                      <TableCell>{formatDate(item.date_published)}</TableCell>
                      <TableCell>{item.assignee_id}</TableCell>
                      <TableCell>
                        <Button size="small">
                          <MoreVert />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>

        <Dialog
          open={openNewContentDialog}
          onClose={handleCloseNewContent}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create New Content</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
            >
              {/* Basic Information */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      name="title"
                      value={newContentData.title}
                      onChange={handleInputChange}
                      required
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={newContentData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Client & Campaign */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Client & Campaign
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Client</InputLabel>
                      <Select
                        value={newContentData.client_id}
                        onChange={handleClientChange}
                        label="Client"
                        required
                      >
                        {suggestions.clients.map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            {client.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth disabled={!selectedClient}>
                      <InputLabel>Campaign</InputLabel>
                      <Select
                        name="campaign_id"
                        value={newContentData.campaign_id}
                        onChange={handleInputChange}
                        label="Campaign"
                      >
                        {availableCampaigns.map((campaign) => (
                          <MenuItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Content Details */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Content Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Content Type</InputLabel>
                      <Select
                        name="content_type"
                        value={newContentData.content_type}
                        onChange={handleInputChange}
                        label="Content Type"
                        required
                      >
                        {CONTENT_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type.replace("_", " ").toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        name="priority"
                        value={newContentData.priority}
                        onChange={handleInputChange}
                        label="Priority"
                        required
                      >
                        {PRIORITY_LEVELS.map((priority) => (
                          <MenuItem key={priority} value={priority}>
                            {getPriorityChip(priority)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={newContentData.status}
                        onChange={handleInputChange}
                        label="Status"
                        required
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <MenuItem key={status} value={status}>
                            {getStatusChip(status)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Due Date */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Timeline
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Due Date"
                      name="due_date"
                      type="date"
                      value={newContentData.due_date}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleCloseNewContent} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleCreateContent} variant="contained">
              Create Content
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={successMessage}
          autoHideDuration={6000}
          onClose={handleCloseSuccessMessage}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseSuccessMessage}
            severity="success"
            sx={{
              width: "100%",
              backgroundColor: "success.main",
              color: "common.white",
              "& .MuiAlert-icon": {
                color: "common.white",
              },
            }}
          >
            Content created successfully!
          </MuiAlert>
        </Snackbar>
      </Card>
      <RightSidebar />
    </Box>
  );
};

export default ContentManagerDashboard;
