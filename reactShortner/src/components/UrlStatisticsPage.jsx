import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLogger } from "../context/LoggingContext";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { formatDistanceToNow, parseISO } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UrlStatisticsPage = ({ shortenedUrls, onRedirect }) => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const logger = useLogger();
  const [urlData, setUrlData] = useState(null);

  useEffect(() => {
    if (shortcode) {
      const foundUrl = shortenedUrls.find((url) => url.shortcode === shortcode);
      if (foundUrl) {
        setUrlData(foundUrl);
        logger.info("Viewing statistics for shortcode", { shortcode });
      } else {
        logger.warn("Shortcode not found", { shortcode });
        navigate("/stats");
      }
    }
  }, [shortcode, shortenedUrls, navigate, logger]);

  const handleRedirect = () => {
    if (urlData) {
      onRedirect(urlData.shortcode);
    }
  };

  if (shortcode && !urlData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  if (!shortcode) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          All Shortened URLs
        </Typography>
        {shortenedUrls.length === 0 ? (
          <Typography variant="body1">No shortened URLs yet.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Clicks</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shortenedUrls.map((url) => (
                  <TableRow key={url.shortcode}>
                    <TableCell>
                      <MuiLink component={Link} to={`/stats/${url.shortcode}`}>
                        {url.shortcode}
                      </MuiLink>
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <MuiLink
                        href={url.longUrl}
                        target="_blank"
                        rel="noopener"
                      >
                        {url.longUrl}
                      </MuiLink>
                    </TableCell>
                    <TableCell>{url.clicks.length}</TableCell>
                    <TableCell>
                      {new Date(url.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(parseISO(url.expiresAt))} left
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        component={Link}
                        to={`/stats/${url.shortcode}`}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/stats" color="inherit">
          Statistics
        </MuiLink>
        <Typography color="text.primary">{shortcode}</Typography>
      </Breadcrumbs>

      <Button
        startIcon={<ArrowBackIcon />}
        component={Link}
        to="/stats"
        sx={{ mb: 2 }}
      >
        Back to all URLs
      </Button>

      <Typography variant="h4" gutterBottom>
        Statistics for {shortcode}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          URL Information
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Short URL:</strong> {window.location.origin}/{shortcode}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Original URL:</strong>{" "}
          <MuiLink href={urlData.longUrl} target="_blank" rel="noopener">
            {urlData.longUrl}
          </MuiLink>
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Created:</strong>{" "}
          {new Date(urlData.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Expires:</strong>{" "}
          {new Date(urlData.expiresAt).toLocaleString()} (in{" "}
          {formatDistanceToNow(parseISO(urlData.expiresAt))})
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Total clicks:</strong> {urlData.clicks.length}
        </Typography>

        <Button variant="contained" onClick={handleRedirect} sx={{ mt: 2 }}>
          Visit URL
        </Button>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Click Analytics
        </Typography>
        {urlData.clicks.length === 0 ? (
          <Typography variant="body1">No clicks recorded yet.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Source</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urlData.clicks.map((click, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(click.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip label={click.location || "Unknown"} size="small" />
                    </TableCell>
                    <TableCell>{click.source || "Direct"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default UrlStatisticsPage;
