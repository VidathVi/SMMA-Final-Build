import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import './RunButton.css';

const RunButton = ({ onClick, isAnalyzing, disabled, loadingText }) => {
    return (
        <button
            className={`geo-run-button ${isAnalyzing ? 'analyzing' : ''}`}
            onClick={onClick}
            disabled={disabled || isAnalyzing}
        >
            <div className="button-content">
                {isAnalyzing ? (
                    <>
                        <Loader2 className="spinner" size={20} />
                        <span className="loading-text-transition">{loadingText || "Analyzing Content..."}</span>
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        <span>Run GEO Analysis</span>
                    </>
                )}

            </div>
            <div className="button-glow"></div>
        </button>
    );
};

export default RunButton;
