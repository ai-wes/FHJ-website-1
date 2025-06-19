// AgentsPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Fab,
} from "@mui/material";
import { Settings, BugReport } from "@mui/icons-material";
import { API_BASE_URL, createFetchOptions } from "../config";
import ClientSelector from "./ClientSelector";
import { useClient } from "./ClientContext";
import "./AgentsPage.css";
import FileOutputBrowser from "./FileOutputBrowser";
import CLIOutputDisplay from './CLIOutputDisplay';

const AgentsPage = () => {
  const { clients, selectedClient, setSelectedClient, setClients } = useClient();
  const [contentInput, setContentInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [crewType, setCrewType] = useState("autoblogging");
  const [crewSettings, setCrewSettings] = useState({
    autoblogging: {
      tone_of_voice: "",
      industry_focus: "",
      target_publications: "",
      company_boilerplate: "",
      spokesperson_name: "",
      spokesperson_title: "",
      contact_information: "",
      release_urgency: "normal",
      target_word_count: "500",
    },
    campaign_planning: {
      focus_topic: "",
      target_audience: "",
      campaign_duration: "",
      key_message: "",
    },
    client_reporting: {
      report_frequency: "daily",
    },
    networking: {
      industry: "",
      location: "",
    },
    pr_research: {
      industry: "",
    },
  });
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [corsTestResult, setCorsTestResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Function to handle changes in crew settings
  const handleCrewSettingChange = (crew, field, value) => {
    setCrewSettings((prev) => ({
      ...prev,
      [crew]: {
        ...prev[crew],
        [field]: value,
      },
    }));
  };

  // Function to handle the execution of the crew process
  const handleExecuteCrew = async () => {
    // Prevent multiple submissions
    if (isProcessing) {
      return;
    }

    // Validate client selection
    if (!selectedClient) {
      setError("Please select a client before proceeding.");
      return;
    }

    // Validate content input
    if (!contentInput.trim()) {
      setError("Please enter content before proceeding.");
      return;
    }

    try {
      setIsProcessing(true);
      setIsExecuting(true);
      setError(null);

      // Format the request data to match backend expectations
      const requestData = {
        topic: contentInput.trim(),
        target_audience: selectedClient.target_audience || "",
        tone_of_voice: crewSettings.autoblogging.tone_of_voice,
        target_word_count: parseInt(crewSettings.autoblogging.target_word_count, 10),
        special_instructions: specialInstructions,
        client_id: selectedClient.id,
        crew_type: crewType,
      };

      console.log("Sending request with data:", requestData); // Debug log

      const options = createFetchOptions("POST", requestData);

      const response = await fetch(`${API_BASE_URL}/execute-crew`, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response:", data); // Debug log

      if (data.status === "success") {
        // Update files list if available
        if (data.result && data.result.files) {
          setFiles(data.result.files);
        }
        // Show success message
        alert("Content processed successfully!");
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (err) {
      console.error("Error executing crew:", err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setIsExecuting(false);
    }
  };

  // Function to handle client selection changes
  const handleClientSelect = useCallback(
    (clientId) => {
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        // Update crew settings based on the selected client
        setCrewSettings((prev) => ({
          ...prev,
          autoblogging: {
            ...prev.autoblogging,
            industry_focus: client.industry || "",
            company_boilerplate: client.boilerplate || "",
            contact_information: client.contact_info || "",
            spokesperson_name: client.spokesperson_name || "",
            spokesperson_title: client.spokesperson_title || "",
          },
          // Optionally, update other crew settings based on the client
        }));
      }
    },
    [clients]
  );

  const testCors = async () => {
    try {
      const options = createFetchOptions("GET");
      const response = await fetch(`${API_BASE_URL}/test-cors`, options);
      if (!response.ok) throw new Error("CORS test failed");
      const data = await response.json();
      console.log("CORS Test Response:", data);
      setCorsTestResult("Success: CORS is working!");
    } catch (err) {
      console.error("CORS Test Error:", err);
      setCorsTestResult(`Error: ${err.message}`);
    }
  };

  // Effect to handle updates when a client is selected
  useEffect(() => {
    if (selectedClient) {
      handleClientSelect(selectedClient.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient]);

  // Function to handle content input changes
  const handleContentChange = (e) => {
    setContentInput(e.target.value);
  };

  // Function to render the appropriate form based on crew type
  const renderCrewForm = () => {
    switch (crewType) {
      case "autoblogging":
        return (
          <Box className="form-container">
            <FormControl fullWidth margin="normal">
              <InputLabel>Tone of Voice</InputLabel>
              <Select
                value={crewSettings.autoblogging.tone_of_voice}
                onChange={(e) =>
                  handleCrewSettingChange("autoblogging", "tone_of_voice", e.target.value)
                }
                label="Tone of Voice"
              >
                <MenuItem value="formal">Formal</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="conversational">Conversational</MenuItem>
                <MenuItem value="technical">Technical</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Target Publications"
              value={crewSettings.autoblogging.target_publications}
              onChange={(e) =>
                handleCrewSettingChange("autoblogging", "target_publications", e.target.value)
              }
            />

            <TextField
              fullWidth
              margin="normal"
              label="Target Word Count"
              type="number"
              value={crewSettings.autoblogging.target_word_count}
              onChange={(e) =>
                handleCrewSettingChange("autoblogging", "target_word_count", e.target.value)
              }
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Release Urgency</InputLabel>
              <Select
                value={crewSettings.autoblogging.release_urgency}
                onChange={(e) =>
                  handleCrewSettingChange("autoblogging", "release_urgency", e.target.value)
                }
                label="Release Urgency"
              >
                <MenuItem value="immediate">Immediate Release</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="embargo">Embargo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case "campaign_planning":
        return (
          <Box className="form-container">
            <TextField
              fullWidth
              margin="normal"
              label="Focus Topic"
              value={crewSettings.campaign_planning.focus_topic}
              onChange={(e) =>
                handleCrewSettingChange("campaign_planning", "focus_topic", e.target.value)
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Target Audience"
              value={crewSettings.campaign_planning.target_audience}
              onChange={(e) =>
                handleCrewSettingChange("campaign_planning", "target_audience", e.target.value)
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Campaign Duration"
              value={crewSettings.campaign_planning.campaign_duration}
              onChange={(e) =>
                handleCrewSettingChange("campaign_planning", "campaign_duration", e.target.value)
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Key Message"
              multiline
              rows={2}
              value={crewSettings.campaign_planning.key_message}
              onChange={(e) =>
                handleCrewSettingChange("campaign_planning", "key_message", e.target.value)
              }
            />
          </Box>
        );

      case "client_reporting":
        return (
          <Box className="form-container">
            <FormControl fullWidth margin="normal">
              <InputLabel>Report Frequency</InputLabel>
              <Select
                value={crewSettings.client_reporting.report_frequency}
                onChange={(e) =>
                  handleCrewSettingChange("client_reporting", "report_frequency", e.target.value)
                }
                label="Report Frequency"
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case "networking":
        return (
          <Box className="form-container">
            <TextField
              fullWidth
              margin="normal"
              label="Industry"
              value={crewSettings.networking.industry}
              onChange={(e) =>
                handleCrewSettingChange("networking", "industry", e.target.value)
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Location"
              value={crewSettings.networking.location}
              onChange={(e) =>
                handleCrewSettingChange("networking", "location", e.target.value)
              }
            />
          </Box>
        );

      case "pr_research":
        return (
          <Box className="form-container">
            <TextField
              fullWidth
              margin="normal"
              label="Industry"
              value={crewSettings.pr_research.industry}
              onChange={(e) =>
                handleCrewSettingChange("pr_research", "industry", e.target.value)
              }
            />
          </Box>
        );

      default:
        return null;
    }
  };

  // Function to determine if the submit button should be disabled
  const isSubmitDisabled = () => {
    // Disable if processing, no content input, or no client selected
    return isProcessing || !contentInput.trim() || !selectedClient;
  };

  // Add ResizeObserver cleanup
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      // Wrap in requestAnimationFrame to prevent loop
      window.requestAnimationFrame(() => {
        // Handle resize if needed
      });
    });

    // Clean up the observer when component unmounts
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <Box className="agents-page-container">
      <Typography variant="h5" className="page-title">
        Agent Control Panel
      </Typography>

      <Stack direction="row" spacing={3}>
        {/* Left Column: Input Forms */}
        <Box flex={1}>
          {/* Content Input Card */}
          <Card className="input-card" sx={{ mb: 3 }}>
            <CardContent>
              <Stack spacing={3}>
                <ClientSelector />
                <FormControl fullWidth>
                  <InputLabel>Process Type</InputLabel>
                  <Select
                    value={crewType}
                    onChange={(e) => setCrewType(e.target.value)}
                    label="Process Type"
                  >
                    <MenuItem value="autoblogging">Autoblogging Content Creation</MenuItem>
                    <MenuItem value="campaign_planning">Campaign Planning</MenuItem>
                    <MenuItem value="client_reporting">Client Reporting</MenuItem>
                    <MenuItem value="networking">Industry Networking</MenuItem>
                    <MenuItem value="pr_research">PR Research</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Content Input"
                  placeholder="Paste your content here..."
                  value={contentInput}
                  onChange={handleContentChange}
                  disabled={isProcessing}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Special Instructions (Optional)"
                  placeholder="Add any specific requirements..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  helperText="E.g., tone preferences, formatting requirements..."
                />
                {error && (
                  <Alert severity="error">
                    {error}
                  </Alert>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleExecuteCrew}
                  disabled={isSubmitDisabled()}
                >
                  {isProcessing ? "Processing..." : "Process Content"}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Advanced Options Card */}
          <Card>
            <CardHeader
              title={
                <Box className="settings-header">
                  <Settings fontSize="small" />
                  <Typography>Advanced Options</Typography>
                </Box>
              }
            />
            <CardContent>
              <Box className="form-container">{renderCrewForm()}</Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column: Output and Files */}
        <Box 
          flex={1} 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Agent Output Card */}
          <Card sx={{ 
            mb: 3, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 0
          }}>
            <CardContent sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              p: 2,
              overflow: 'auto'
            }}>
              <Typography variant="h6" gutterBottom>
                Agent Output
              </Typography>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <CLIOutputDisplay  />
              </Box>
            </CardContent>
          </Card>

          {/* Generated Files Card */}
          <Card sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 0
          }}>
            <CardContent sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              p: 2,
              overflow: 'auto'
            }}>
              <Typography variant="h6" gutterBottom>
                Generated Files
              </Typography>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <FileOutputBrowser />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      <Fab 
        color="primary" 
        onClick={testCors}
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16 
        }}
        title="Test CORS Connection"
      >
        <BugReport />
      </Fab>
      
      {corsTestResult && (
        <Alert 
          severity={corsTestResult.includes("Error") ? "error" : "success"}
          sx={{ 
            position: 'fixed', 
            bottom: 80, 
            right: 16, 
            maxWidth: '300px' 
          }}
        >
          {corsTestResult}
        </Alert>
      )}
    </Box>
  );
};

export default AgentsPage;
