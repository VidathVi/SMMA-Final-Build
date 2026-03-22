import React, { useState, useEffect } from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import './GEOStudio.css';

const loadingMessages = [
  "Analyzing keyword density...",
  "Evaluating semantic relevance...",
  "Checking competitor overlap...",
  "Optimizing for search intent...",
  "Finalizing generative scores..."
];

const GEOStudio = () => {
  const [formData, setFormData] = useState({
    keyPoints: '',
    platform: 'Instagram',
    tone: 'Professional',
    goal: 'Engagement',
    tags: [],
    attachedFile: null,
    advanced: {
      density: 50,
      creativity: 50,
      audience: 'General',
      length: 'Medium'
    }
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingMessages[0]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      let msgIndex = 0;
      interval = setInterval(() => {
        msgIndex = (msgIndex + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[msgIndex]);
      }, 800);
    } else {
      setLoadingText(loadingMessages[0]);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);


  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResults({
        best: {
          id: 'best',
          score: 92,
          content: "Elevate your strategy with Generative Engine Optimization. Our comprehensive platform adapts seamlessly across all channels, ensuring your content not only ranks but consistently engages your target audience.",
          breakdown: { seo: 95, engagement: 90, readability: 88, platform: 92 }
        },
        alternatives: [
          {
            id: 'alt1',
            score: 84,
            content: "Looking to boost your digital presence? Discover how GEO Studio leverages deep neural-insights to craft performing content across platforms. Get ahead of the curve and optimize natively today.",
            breakdown: { seo: 88, engagement: 82, readability: 85, platform: 80 }
          },
          {
            id: 'alt2',
            score: 79,
            content: "Tired of manual content tuning? Let our Generative Engine Optimization streamline your workflow. Maximize impact, minimize effort, and reach your audience effectively.",
            breakdown: { seo: 80, engagement: 78, readability: 83, platform: 75 }
          }
        ]
      });
    }, 3000);

  };
  const hasStarted = results !== null;

  return (
    <div className="geo-studio-container">
      <header className="geo-studio-header">
        <h1>GEO Studio</h1>
        <p style={{ color: 'var(--geo-text-secondary)', margin: '0.5rem 0 0 0' }}>
          Input & Configuration for Generative Engine Optimization
        </p>
      </header>
      <main className={`geo-studio-main ${hasStarted ? 'layout-split' : 'layout-single'}`} style={{ transition: 'all 0.5s ease-in-out' }}>

        <div className="slide-up">
          <LeftPanel
            formData={formData}
            setFormData={setFormData}
            onRun={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {results && (
          <div className="slide-up" style={{ animationDelay: '0.2s' }}>
            <RightPanel
              results={results}
              isAnalyzing={false}
            />
          </div>
        )}

      </main>
    </div>
  );
};

export default GEOStudio;
