import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { LoggingProvider } from "./context/LoggingContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import UrlShortenerForm from "./components/UrlShortenerForm";
import UrlStatisticsPage from "./components/UrlStatisticsPage";
import ShortenedUrlCard from "./components/ShortenedUrlCard";

const theme = createTheme();

const App = () => {
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [copiedShortcode, setCopiedShortcode] = useState(null);

  const handleShorten = (newUrls) => {
    setShortenedUrls([...shortenedUrls, ...newUrls]);
  };

  const handleCopy = (shortcode) => {
    setCopiedShortcode(shortcode);
    setTimeout(() => setCopiedShortcode(null), 2000);
  };

  const handleRedirect = (shortcode) => {
    const url = shortenedUrls.find((u) => u.shortcode === shortcode);
    if (url) {
      // Record the click
      const updatedUrls = shortenedUrls.map((u) => {
        if (u.shortcode === shortcode) {
          return {
            ...u,
            clicks: [
              ...u.clicks,
              {
                timestamp: new Date().toISOString(),
                source: document.referrer || "Direct",
                location: navigator.geolocation
                  ? "Simulated Location"
                  : "Unknown",
              },
            ],
          };
        }
        return u;
      });
      setShortenedUrls(updatedUrls);

      // Redirect to the original URL
      window.open(url.longUrl, "_blank");
    }
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LoggingProvider>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                URL Shortener
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/stats">
                Statistics
              </Button>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <UrlShortenerForm
                      onShorten={handleShorten}
                      shortenedUrls={shortenedUrls}
                    />
                    {shortenedUrls.length > 0 && (
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                          Your Shortened URLs
                        </Typography>
                        {shortenedUrls.map((url, index) => (
                          <ShortenedUrlCard
                            key={index}
                            url={url}
                            onCopy={handleCopy}
                            onRedirect={handleRedirect}
                          />
                        ))}
                      </Box>
                    )}
                    {copiedShortcode && (
                      <Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
                        <Chip
                          label="Copied to clipboard!"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </>
                }
              />
              <Route
                path="/stats/*"
                element={
                  <UrlStatisticsPage
                    shortenedUrls={shortenedUrls}
                    onRedirect={handleRedirect}
                  />
                }
              />
              <Route
                path="/:shortcode"
                element={
                  shortenedUrls.length > 0 ? (
                    <Navigate to="/" />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </Container>
        </LoggingProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
