import React from 'react';
import './BreakdownMetrics.css';

const BreakdownMetrics = ({ metrics }) => {
    if (!metrics) return null;

    return (
        <div className="metrics-grid">
            <div className="metric-item">
                <div className="metric-header">
                    <span className="metric-label">SEO Score</span>
                    <span className="metric-value">{metrics.seo}%</span>
                </div>
                <div className="metric-bar-bg">
                    <div className="metric-bar-fill seo" style={{ width: `${metrics.seo}%` }}></div>
                </div>
            </div>

            <div className="metric-item">
                <div className="metric-header">
                    <span className="metric-label">Engagement</span>
                    <span className="metric-value">{metrics.engagement}%</span>
                </div>
                <div className="metric-bar-bg">
                    <div className="metric-bar-fill engagement" style={{ width: `${metrics.engagement}%` }}></div>
                </div>
            </div>

            <div className="metric-item">
                <div className="metric-header">
                    <span className="metric-label">Readability</span>
                    <span className="metric-value">{metrics.readability}%</span>
                </div>
                <div className="metric-bar-bg">
                    <div className="metric-bar-fill readability" style={{ width: `${metrics.readability}%` }}></div>
                </div>
            </div>

            <div className="metric-item">
                <div className="metric-header">
                    <span className="metric-label">Platform Fit</span>
                    <span className="metric-value">{metrics.platform}%</span>
                </div>
                <div className="metric-bar-bg">
                    <div className="metric-bar-fill platform" style={{ width: `${metrics.platform}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default BreakdownMetrics;
