import React from 'react';
import './ScoreBadge.css';

const ScoreBadge = ({ score, size = 'md' }) => {
    // Determine color based on score
    let badgeClass = 'score-average';
    if (score >= 90) badgeClass = 'score-excellent';
    else if (score >= 75) badgeClass = 'score-good';
    else if (score < 60) badgeClass = 'score-poor';

    // Determine size class
    const sizeClass = `size-${size}`; // 'sm' or 'md' or 'lg'

    return (
        <div className={`score-badge ${badgeClass} ${sizeClass}`}>
            <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                    className="circle-bg"
                    d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                    className="circle"
                    strokeDasharray={`${score}, 100`}
                    d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">{Math.round(score)}</text>
            </svg>
        </div>
    );
};

export default ScoreBadge;
