import React from "react";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  List as StepsIcon,
  RateReview as ReviewIcon,
  Chat as ChatIcon,
  FormatPaint,
  PersonOutline,
  Psychology,
  People,
  CalendarToday,
  PostAdd,
} from "@mui/icons-material";
import logo from "../assets/sam_moore_logo_white.png";

const NavigationBar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/knowledge-discovery", label: "Knowledge Discovery", icon: <Psychology /> },

    { path: "/", label: "Content Manager", icon: <DashboardIcon /> },
    {
      path: "/tabbed-dashboard",
      label: "Content Creation",
      icon: <FormatPaint />,
    },

    { path: "/multi-platform-posting", label: "Multi-Platform Posting", icon: <PostAdd /> },
    { path: "/content-posting-calendar", label: "Content Posting Calendar", icon: <CalendarToday /> },

    { path: "/clients", label: "Clients Registry", icon: <People /> },
    { path: "/reports", label: "Reports", icon: <StepsIcon /> },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "rgba(25, 118, 210, 0.8)", // 20% transparent
        backdropFilter: "blur(8px)", // Add blur effect for better readability
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo Section */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",

            textDecoration: "none",
            color: "inherit",
            mr: 2,
          }}
        >
          <img
            src={logo}
            alt="Sam Moore Comms"
            style={{
              height: "50px",
              padding: "10px",
              marginRight: "10px",
            }}
          />
        </Box>

        {/* Navigation Items */}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            marginTop: "5px",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",

            justifyContent: "center",
            gap: 2,
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              sx={{
                textTransform: "none",
                px: 3,
                py: 1,
                backgroundColor:
                  location.pathname === item.path
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                color: location.pathname === item.path ? "#ffddd4" : "inherit",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
              startIcon={item.icon}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
