import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Box,
  Paper,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  AutoFixHigh,
  History,
  Settings,
  ContentCopy,
  Refresh,
  Add,
  Image as ImageIcon,
  Download,
  TextFields,
} from "@mui/icons-material";
import HistoryViewer from "./HistoryViewer";
import TextOverlaySelector from "./TextOverlaySelector";
import { API_BASE_URL } from "../config";

// Move these component definitions outside of VisualContentGenerator
const ContentAnalyzer = ({
  analysis,
  isAnalyzing,
  handleAnalyzeContent,
  contentInput,
  error,
  setError,
  handleCopyPrompt,
  setImagePrompt,
}) => {
  console.log("Rendering ContentAnalyzer with analysis:", analysis);
  return (
    <Card
      sx={{
        mt: 2,
        backgroundColor: "#257bd0",
        boxShadow:
          "rgba(0, 0, 0, 0.4) 0px 10px 30px, rgba(0, 0, 0, 0.2) 0px 6px 12px",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <AutoFixHigh sx={{ mr: 1 }} fontSize="small" />
            Content Analysis
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={
              isAnalyzing ? <CircularProgress size={20} /> : <Refresh />
            }
            onClick={handleAnalyzeContent}
            disabled={isAnalyzing || !contentInput.content}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </Button>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              "& .MuiAlert-message": {
                width: "100%",
                wordBreak: "break-word",
              },
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {analysis && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Prompts Section */}
              {analysis.content_structure && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Suggested Image Prompts
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {Object.entries(analysis.content_structure)
                      .filter(([key]) => key.startsWith("prompt_"))
                      .map(([key, prompt], index) => (
                        <Paper
                          key={key}
                          sx={{
                            p: 2,
                            bgcolor: "grey.50",
                            boxShadow:
                              "rgba(0, 0, 0, 0.25) 0px 6px 18px, rgba(0, 0, 0, 0.12) 0px 3px 8px",
                            "&:hover": {
                              bgcolor: "grey.100",
                              boxShadow:
                                "rgba(0, 0, 0, 0.3) 0px 8px 24px, rgba(0, 0, 0, 0.15) 0px 4px 10px",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">
                              <strong>Prompt {index + 1}:</strong>
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleCopyPrompt(prompt)}
                                sx={{
                                  bgcolor: "white",
                                  "&:hover": { bgcolor: "grey.200" },
                                }}
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => setImagePrompt(prompt)}
                                startIcon={<Add fontSize="small" />}
                                sx={{ ml: 1 }}
                              >
                                Use Prompt
                              </Button>
                            </Box>
                          </Box>
                          <Typography variant="body2">{prompt}</Typography>
                        </Paper>
                      ))}
                  </Box>
                </Grid>
              )}

              {/* Divider between prompts and analysis */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Analysis Sections */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Key Points
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {analysis.key_points.map((point, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Chip label={index + 1} size="small" />
                      <Typography variant="body2">{point}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Tone & Target Audience
                </Typography>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2">
                    <strong>Tone:</strong> {analysis.tone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Target Audience:</strong> {analysis.target_audience}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Suggested Improvements
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {analysis.suggested_improvements.map((improvement, index) => (
                    <Alert
                      key={index}
                      severity="info"
                      sx={{ "& .MuiAlert-message": { width: "100%" } }}
                    >
                      {improvement}
                    </Alert>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const GeneratedImages = ({
  imagePrompt,
  setImagePrompt,
  handleGenerateImages,
  isGenerating,
  generatedImages,
  handleCopyPrompt,
  handleDownload,
  handleTextOverlay,
  textOverlayOpen,
  setTextOverlayOpen,
  selectedImage,
  handleApplyOverlay,
  ENDPOINTS,
  textFieldStyle,
  contentInput,
}) => {
  console.log("Rendering GeneratedImages component");
  return (
    <Box
      sx={{
        mt: 4,
        backgroundColor: "#ffddd4",
        p: 2,
        boxShadow:
          "rgba(0, 0, 0, 0.35) 0px 8px 24px, rgba(0, 0, 0, 0.2) 0px 3px 8px",
        borderRadius: 2,
        border: "1px solid grey",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Image Generation
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter your own prompt or use one of the suggested prompts above.
        </Typography>
        <Box
          sx={{
            display: "flex",
            borderRadius: 2,
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            label="Enter image generation prompt"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            multiline
            rows={3}
            variant="outlined"
            sx={{
              ...textFieldStyle,
              "& .MuiOutlinedInput-root": {
                ...textFieldStyle["& .MuiOutlinedInput-root"],
                backgroundColor: "white",
                boxShadow:
                  "rgba(0, 0, 0, 0.15) 0px 4px 12px, rgba(0, 0, 0, 0.1) 0px 2px 4px",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleGenerateImages}
            disabled={isGenerating || !imagePrompt.trim()}
            startIcon={
              isGenerating ? <CircularProgress size={20} /> : <ImageIcon />
            }
          >
            Generate
          </Button>
        </Box>
      </Box>

      {/* Only show generated images section if there are actually images */}
      {generatedImages.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Generated Visuals
          </Typography>
          <Grid container spacing={2}>
            {generatedImages.map((image, index) => (
              <Grid item xs={6} key={image.id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        paddingTop: "100%", // 1:1 Aspect ratio
                        backgroundColor: "grey.100",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={`${ENDPOINTS.downloadImage(image.path)}`}
                        alt={`Generated ${index + 1}`}
                        onError={(e) => {
                          console.error("Image failed to load");
                          e.target.src =
                            "https://via.placeholder.com/512?text=Image+Failed+to+Load"; // Placeholder image
                        }}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Box sx={{ flex: 1, mr: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {image.prompt.length > 50
                            ? `${image.prompt.substring(0, 50)}...`
                            : image.prompt}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleCopyPrompt(image.prompt)}
                          sx={{
                            bgcolor: "grey.100",
                            "&:hover": { bgcolor: "grey.200" },
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(image.path)}
                          sx={{
                            bgcolor: "grey.100",
                            "&:hover": { bgcolor: "grey.200" },
                          }}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button
                        size="small"
                        startIcon={<TextFields />}
                        onClick={() => handleTextOverlay(image)}
                      >
                        Add Text Overlay
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <TextOverlaySelector
        open={textOverlayOpen}
        onClose={() => setTextOverlayOpen(false)}
        image={selectedImage}
        content={contentInput.content}
        onApplyOverlay={handleApplyOverlay}
      />
    </Box>
  );
};

const VisualContentGenerator = () => {
  // Define styles
  const textFieldStyle = {
    backgroundColor: "white",
    borderRadius: 2,
    boxShadow:
      "rgba(0, 0, 0, 0.3) 0px 8px 24px, rgba(0, 0, 0, 0.15) 0px 3px 8px",
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      fontSize: "0.875rem",
      border: "1px solid rgba(0, 0, 0, 0.2)",
      "&:hover": {
        border: "1px solid rgba(0, 0, 0, 0.3)",
      },
      "&.Mui-focused": {
        border: "1px solid #1976d2",
        boxShadow: "rgba(25, 118, 210, 0.25) 0px 0px 0px 3px",
      },
      "& fieldset": {
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "transparent",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "rgba(0, 0, 0, 0.7)",
    },
  };

  // ResizeObserver cleanup
  useEffect(() => {
    console.log("Setting up ResizeObserver");
    const resizeObserver = new ResizeObserver(() => {
      // Intentionally empty
    });

    return () => {
      console.log("Cleaning up ResizeObserver");
      resizeObserver.disconnect();
    };
  }, []);

  // State management
  const [contentInput, setContentInput] = useState({
    title: "",
    content: "",
    notes: "",
  });

  const [analysis, setAnalysis] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  const [textOverlayOpen, setTextOverlayOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  // API endpoints
  const ENDPOINTS = {
    analyzeContent: `${API_BASE_URL}/analyze-content`,
    generateImages: `${API_BASE_URL}/generate-images`,
    historyImages: (id) => `${API_BASE_URL}/history/${id}/images`,
    downloadImage: (path) => `${API_BASE_URL}/uploads/generated/${path}`,
  };

  // Content Analysis Handler
  const handleAnalyzeContent = async () => {
    console.log("Starting content analysis...");
    setIsAnalyzing(true);
    setError(null);

    // Validate input
    if (!contentInput.content.trim()) {
      setError("Please enter some content to analyze");
      setIsAnalyzing(false);
      return;
    }

    try {
      console.log("Sending analysis request with content:", contentInput);
      const response = await fetch(ENDPOINTS.analyzeContent, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contentInput),
      });

      console.log("Analysis response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Analysis failed with status ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log("Analysis response data:", responseData);

      // Check if the response has the expected structure
      if (!responseData.data || typeof responseData.data !== "object") {
        throw new Error("Invalid response format: missing data object");
      }

      const analysisResult = responseData.data;

      // Validate the analysis result has all required fields
      const requiredFields = [
        "key_points",
        "tone",
        "target_audience",
        "suggested_improvements",
        "content_structure",
      ];
      for (const field of requiredFields) {
        if (!(field in analysisResult)) {
          throw new Error(`Missing required field in analysis: ${field}`);
        }
      }

      // Validate content_structure has all required prompts
      const requiredPrompts = ["prompt_1", "prompt_2", "prompt_3", "prompt_4"];
      for (const prompt of requiredPrompts) {
        if (!(prompt in analysisResult.content_structure)) {
          throw new Error(
            `Missing required prompt in content_structure: ${prompt}`
          );
        }
      }

      console.log("Setting analysis result:", analysisResult);
      setAnalysis(analysisResult);

      // Store the history entry ID if it's in the response
      if (responseData.data.id) {
        console.log("Setting history ID:", responseData.data.id);
        setCurrentHistoryId(responseData.data.id);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Image Generation Handler
  const handleGenerateImages = async () => {
    console.log("Starting image generation with prompt:", imagePrompt);

    if (!imagePrompt.trim()) {
      console.log("Empty prompt, showing error");
      setError("Please enter an image prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Sending generation request with prompts:", [imagePrompt]);
      const response = await fetch(ENDPOINTS.generateImages, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "omit", // Don't send credentials for cross-origin requests
        body: JSON.stringify({
          prompts: [imagePrompt],
        }),
      });

      console.log("Generation response status:", response.status);
      console.log(
        "Generation response headers:",
        Object.fromEntries(response.headers)
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error ||
            `Image generation failed with status ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Generation result:", result);

      if (result.status === "success" && Array.isArray(result.images)) {
        setGeneratedImages(result.images);

        // If we have a current history entry, update it with the new images
        if (currentHistoryId) {
          console.log(
            "Updating history with new images for ID:",
            currentHistoryId
          );
          await fetch(ENDPOINTS.historyImages(currentHistoryId), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(result.images),
          });
        }
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Handler
  const handleDownload = async (imagePath) => {
    console.log("Starting download for image:", imagePath);
    try {
      const response = await fetch(ENDPOINTS.downloadImage(imagePath));
      console.log("Download response status:", response.status);

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      console.log("Downloaded blob:", blob);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = imagePath;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download image");
    }
  };

  // Copy Prompt Handler
  const handleCopyPrompt = async (prompt) => {
    console.log("Copying prompt:", prompt);
    try {
      await navigator.clipboard.writeText(prompt);
      console.log("Prompt copied successfully");
    } catch (err) {
      console.error("Failed to copy prompt:", err);
      setError("Failed to copy prompt");
    }
  };

  // History Handlers
  const handleHistoryClick = () => {
    console.log("Opening history dialog");
    setHistoryOpen(true);
  };

  // Content Input Handler
  const handleContentInputChange = (field) => (event) => {
    const value = event.target.value;
    setContentInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Text Overlay Handlers
  const handleTextOverlay = (image) => {
    console.log("Opening text overlay for image:", image);
    setSelectedImage(image);
    setTextOverlayOpen(true);
  };

  const handleApplyOverlay = (result) => {
    console.log("Applying text overlay with result:", result);
    // Update the generated images with the new overlaid version
    setGeneratedImages((prev) =>
      prev.map((img) =>
        img.id === selectedImage.id ? { ...img, overlaid_version: result } : img
      )
    );
  };

  // Main Layout
  return (
    <Card
      className="custom-card"
      sx={{
        maxWidth: "xl",
        width: "100%",
        m: "auto",
        backgroundColor: "#257bd0ad !important",
        borderRadius: 5,
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Visual Content Generator
          </Typography>
        }
        action={
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<History />}
              onClick={handleHistoryClick}
              sx={{
                borderRadius: 5,
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "grey.100",
                  borderRadius: 5,
                },
              }}
            >
              History
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Settings />}
              sx={{
                borderRadius: 5,
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "grey.100",
                },
              }}
            >
              Settings
            </Button>
          </Box>
        }
      />

      <CardContent>
        <Grid container spacing={3}>
          {/* Left Column - Content Input */}
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: 5,
              }}
            >
              <TextField
                sx={textFieldStyle}
                label="Title"
                value={contentInput.title}
                onChange={handleContentInputChange("title")}
                fullWidth
              />

              <TextField
                sx={textFieldStyle}
                label="Content"
                multiline
                rows={8}
                value={contentInput.content}
                onChange={handleContentInputChange("content")}
                fullWidth
              />

              <TextField
                sx={textFieldStyle}
                label="Additional Notes/Considerations"
                multiline
                rows={4}
                value={contentInput.notes}
                onChange={handleContentInputChange("notes")}
                fullWidth
              />

              <ContentAnalyzer
                analysis={analysis}
                isAnalyzing={isAnalyzing}
                handleAnalyzeContent={handleAnalyzeContent}
                contentInput={contentInput}
                error={error}
                setError={setError}
                handleCopyPrompt={handleCopyPrompt}
                setImagePrompt={setImagePrompt}
              />
            </Box>
          </Grid>

          {/* Right Column - Image Generation Interface */}
          <Grid item xs={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <GeneratedImages
                imagePrompt={imagePrompt}
                setImagePrompt={setImagePrompt}
                handleGenerateImages={handleGenerateImages}
                isGenerating={isGenerating}
                generatedImages={generatedImages}
                handleCopyPrompt={handleCopyPrompt}
                handleDownload={handleDownload}
                handleTextOverlay={handleTextOverlay}
                textOverlayOpen={textOverlayOpen}
                setTextOverlayOpen={setTextOverlayOpen}
                selectedImage={selectedImage}
                handleApplyOverlay={handleApplyOverlay}
                ENDPOINTS={ENDPOINTS}
                textFieldStyle={textFieldStyle}
                contentInput={contentInput}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      {/* History Viewer */}
      <HistoryViewer open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </Card>
  );
};

export default VisualContentGenerator;
