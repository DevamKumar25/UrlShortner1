import React, { useState } from "react";
import { useLogger } from "../context/LoggingContext";
import {
  validateUrl,
  validateShortcode,
  validateExpiration,
} from "../utils/validators";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const UrlShortenerForm = ({ onShorten, shortenedUrls }) => {
  const logger = useLogger();
  const [urls, setUrls] = useState([
    { longUrl: "", shortcode: "", validity: 30 },
  ]);
  const [errors, setErrors] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleAddUrl = () => {
    if (urls.length >= 5) {
      showMessage("Maximum of 5 URLs allowed", "warning");
      return;
    }
    setUrls([...urls, { longUrl: "", shortcode: "", validity: 30 }]);
    logger.info("Added new URL input field");
  };

  const handleRemoveUrl = (index) => {
    if (urls.length <= 1) return;
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
    logger.info("Removed URL input field", { index });
  };

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);

    // Clear error for this field when user types
    const newErrors = [...errors];
    const errorIndex = newErrors.findIndex(
      (e) => e.index === index && e.field === field
    );
    if (errorIndex !== -1) {
      newErrors.splice(errorIndex, 1);
      setErrors(newErrors);
    }
  };

  const showMessage = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
    logger[severity]?.(message) || logger.info(message);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validateInputs = () => {
    const newErrors = [];
    let isValid = true;

    urls.forEach((url, index) => {
      if (!url.longUrl.trim()) {
        newErrors.push({ index, field: "longUrl", message: "URL is required" });
        isValid = false;
      } else if (!validateUrl(url.longUrl)) {
        newErrors.push({
          index,
          field: "longUrl",
          message: "Invalid URL format",
        });
        isValid = false;
      }

      if (url.shortcode && !validateShortcode(url.shortcode)) {
        newErrors.push({
          index,
          field: "shortcode",
          message: "Shortcode must be 4-20 alphanumeric chars",
        });
        isValid = false;
      }

      if (url.validity && !validateExpiration(url.validity)) {
        newErrors.push({
          index,
          field: "validity",
          message: "Validity must be a positive number",
        });
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logger.debug("Attempting to shorten URLs", { urls });

    if (!validateInputs()) {
      showMessage("Please fix the errors in the form", "error");
      return;
    }

    // Generate shortcodes for URLs that don't have them
    const urlsWithShortcodes = urls.map((url) => {
      if (!url.shortcode) {
        const randomShortcode = Math.random().toString(36).substring(2, 8);
        return { ...url, shortcode: randomShortcode };
      }
      return url;
    });

    // Check for duplicate shortcodes
    const shortcodes = urlsWithShortcodes.map((url) => url.shortcode);
    const uniqueShortcodes = new Set(shortcodes);
    if (shortcodes.length !== uniqueShortcodes.size) {
      showMessage("Shortcodes must be unique", "error");
      return;
    }

    // Check if any shortcodes already exist in shortenedUrls
    const existingShortcodes = shortenedUrls.map((url) => url.shortcode);
    const collision = urlsWithShortcodes.some((url) =>
      existingShortcodes.includes(url.shortcode)
    );
    if (collision) {
      showMessage("One or more shortcodes are already in use", "error");
      return;
    }

    // Calculate expiration dates
    const now = new Date();
    const urlsWithExpiry = urlsWithShortcodes.map((url) => {
      const expiryDate = new Date(now.getTime() + url.validity * 60000);
      return {
        longUrl: url.longUrl,
        shortcode: url.shortcode,
        createdAt: now.toISOString(),
        expiresAt: expiryDate.toISOString(),
        clicks: [],
      };
    });

    onShorten(urlsWithExpiry);
    showMessage("URLs shortened successfully!", "success");
    setUrls([{ longUrl: "", shortcode: "", validity: 30 }]);
    logger.info("URLs shortened", { count: urlsWithExpiry.length });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Shorten URLs
      </Typography>
      <form onSubmit={handleSubmit}>
        {urls.map((url, index) => (
          <Box
            key={index}
            sx={{ mb: 3, p: 2, border: "1px solid #eee", borderRadius: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Long URL"
                  variant="outlined"
                  value={url.longUrl}
                  onChange={(e) =>
                    handleChange(index, "longUrl", e.target.value)
                  }
                  error={errors.some(
                    (e) => e.index === index && e.field === "longUrl"
                  )}
                  helperText={
                    errors.find(
                      (e) => e.index === index && e.field === "longUrl"
                    )?.message
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Custom Shortcode (optional)"
                  variant="outlined"
                  value={url.shortcode}
                  onChange={(e) =>
                    handleChange(index, "shortcode", e.target.value)
                  }
                  error={errors.some(
                    (e) => e.index === index && e.field === "shortcode"
                  )}
                  helperText={
                    errors.find(
                      (e) => e.index === index && e.field === "shortcode"
                    )?.message
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Validity (minutes)"
                  type="number"
                  variant="outlined"
                  value={url.validity}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "validity",
                      parseInt(e.target.value) || 30
                    )
                  }
                  error={errors.some(
                    (e) => e.index === index && e.field === "validity"
                  )}
                  helperText={
                    errors.find(
                      (e) => e.index === index && e.field === "validity"
                    )?.message
                  }
                />
              </Grid>
              <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                {urls.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveUrl(index)}
                    color="error"
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
                {index === urls.length - 1 && urls.length < 5 && (
                  <IconButton onClick={handleAddUrl} color="primary">
                    <AddIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button type="submit" variant="contained" color="primary" size="large">
          Shorten URLs
        </Button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UrlShortenerForm;
