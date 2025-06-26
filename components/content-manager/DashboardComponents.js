import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  TrendingUp,
  Group,
  Timeline,
  Search as SearchIcon,
} from "@mui/icons-material";

const StatCard = ({ title, value, change, icon }) => (
  <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
      }}
    >
      <Box>
        <Typography color="textSecondary" variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        <Typography
          color={change.startsWith("+") ? "success.main" : "error.main"}
          variant="body2"
        >
          {change} from last month
        </Typography>
      </Box>
      <Box sx={{ color: "primary.main" }}>{icon}</Box>
    </Box>
  </Paper>
);

const DashboardComponents = () => {
  const [tabValue, setTabValue] = React.useState(0);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={{ textTransform: "none" }}
          >
            Refresh
          </Button>
          <IconButton>
            <NotificationsIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Search Section */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search analytics..."
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />
          <Button variant="contained">Search</Button>
        </Box>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value="12,486"
            change="+4.2%"
            icon={<Group fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Sessions"
            value="3,428"
            change="+8.4%"
            icon={<Timeline fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Conversion Rate"
            value="24.8%"
            change="+12.6%"
            icon={<TrendingUp fontSize="large" />}
          />
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Overview" />
          <Tab label="Analytics" />
          <Tab label="Reports" />
          <Tab label="Notifications" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Button size="small" sx={{ mr: 1 }}>
              Daily
            </Button>
            <Button size="small" sx={{ mr: 1 }}>
              Weekly
            </Button>
            <Button size="small">Monthly</Button>
          </Box>
          {/* Add your charts/graphs here */}
          <Box
            sx={{
              height: "300px",
              bgcolor: "background.default",
              borderRadius: 1,
              p: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary" align="center">
              Chart/Graph Content Area
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardComponents;
