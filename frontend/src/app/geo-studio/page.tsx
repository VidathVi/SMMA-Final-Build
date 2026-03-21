"use client";

// Import all GEO Studio CSS files
import "./src/GEOStudio.css";
import "./src/LeftPanel.css";
import "./src/RightPanel.css";
import "./src/components/ui/GlassCard.css";
import "./src/components/ui/RunButton.css";
import "./src/components/ui/ScoreBadge.css";
import "./src/components/ui/BreakdownMetrics.css";

// Import the main GEOStudio component
import GEOStudio from "./src/GEOStudio";

export default function GeoStudioPage() {
  return <GEOStudio />;
}
