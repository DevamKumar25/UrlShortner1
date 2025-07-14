import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Link,
  Divider,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BarChartIcon from "@mui/icons-material/BarChart";
import { formatDistanceToNow, parseISO } from "date-fns";

const ShortenedUrlCard = ({ url, onCopy, onRedirect }) => {
  const shortUrl = `${window.location.origin}/${url.shortcode}`;
  const expiresIn = formatDistanceToNow(parseISO(url.expiresAt));
  const createdAt = new Date(url.createdAt).toLocaleString();
  const expiresAt = new Date(url.expiresAt).toLocaleString();

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    onCopy(url.shortcode);
  };

  const handleRedirect = () => {
    onRedirect(url.shortcode);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" noWrap>
              <Link href={shortUrl} target="_blank" rel="noopener">
                {shortUrl}
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Original:{" "}
              <Link href={url.longUrl} target="_blank" rel="noopener">
                {url.longUrl}
              </Link>
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ textAlign: { xs: "left", sm: "right" } }}
          >
            <Tooltip title="Copy to clipboard">
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopy}
                sx={{ mr: 1 }}
              >
                Copy
              </Button>
            </Tooltip>
            <Tooltip title="View statistics">
              <Button
                variant="outlined"
                startIcon={<BarChartIcon />}
                component={RouterLink}
                to={`/stats/${url.shortcode}`}
                sx={{ mr: 1 }}
              >
                Stats
              </Button>
            </Tooltip>
            <Tooltip title="Visit URL">
              <Button
                variant="contained"
                startIcon={<OpenInNewIcon />}
                onClick={handleRedirect}
              >
                Visit
              </Button>
            </Tooltip>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <strong>Created:</strong> {createdAt}
            </Typography>
            <Typography variant="body2">
              <strong>Expires:</strong> {expiresAt} (in {expiresIn})
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <strong>Clicks:</strong> {url.clicks.length}
            </Typography>
            {url.clicks.length > 0 && (
              <Typography variant="body2">
                <strong>Last click:</strong>{" "}
                {new Date(
                  url.clicks[url.clicks.length - 1].timestamp
                ).toLocaleString()}
              </Typography>
            )}
          </Grid>
        </Grid>

        {url.clicks.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Recent clicks:</Typography>
            {url.clicks.slice(-3).map((click, index) => (
              <Chip
                key={index}
                label={`${new Date(click.timestamp).toLocaleTimeString()} - ${
                  click.location || "Unknown location"
                }`}
                size="small"
                sx={{ mr: 1, mt: 1 }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ShortenedUrlCard;
