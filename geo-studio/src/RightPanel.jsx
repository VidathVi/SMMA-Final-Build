import React from 'react';
import { Sparkles, Copy, Check, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react';
import GlassCard from './components/ui/GlassCard';
import ScoreBadge from './components/ui/ScoreBadge';
import BreakdownMetrics from './components/ui/BreakdownMetrics';
import './RightPanel.css';


const RightPanel = ({ results, isAnalyzing }) => {
    const [copied, setCopied] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState('best');

    // Reset selection when new results arrive
    React.useEffect(() => {
        if (results) setSelectedId('best');
    }, [results]);

    const handleCopy = (text) => {
        if (text) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const currentVariation =
        selectedId === 'best'
            ? results?.best
            : results?.alternatives?.find(alt => alt.id === selectedId);


    if (!results && !isAnalyzing) {
        return (
            <section className="right-panel">
                <div className="results-placeholder">
                    <div className="placeholder-content">
                        <Sparkles size={48} className="placeholder-icon" />
                        <h2>Ready to Optimize</h2>
                        <p>Configure your content settings and run the analysis to see AI-generated variations here.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="right-panel">
            {/* Main Variation Card */}
            {currentVariation && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <GlassCard glowColor="rgba(0, 210, 255, 0.15)">
                        <div className="best-variation-header">
                            <div className="best-variation-title">
                                <Sparkles size={24} color="var(--geo-neon-blue)" />
                                <h3>{selectedId === 'best' ? 'Best Variation' : 'Alternative Variation'}</h3>
                                {selectedId === 'best' && <span className="best-badge">Top Pick</span>}
                            </div>
                            <ScoreBadge score={currentVariation.score} size="md" />
                        </div>


                        <div className="content-preview">
                            <div className="content-text">
                                {currentVariation.content}
                            </div>
                        </div>

                        <BreakdownMetrics metrics={currentVariation.breakdown} />

                        <div className="action-buttons">
                            <button className="text-btn secondary-btn" onClick={() => console.log('Edit Caption Clicked')}>
                                Edit Caption
                            </button>
                            <button className="text-btn primary-btn" onClick={() => handleCopy(currentVariation.content)}>
                                {copied ? <Check size={18} style={{ marginRight: '8px' }} /> : null}
                                {copied ? 'Copied!' : 'Use this Caption'}
                            </button>
                        </div>
                    </GlassCard>

                    {/* Alternative Variations */}
                    {results?.alternatives?.length > 0 && (
                        <div className="alternatives-section">
                            <h3 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--geo-text-secondary)' }}>
                                All Variations
                            </h3>
                            <div className="alternatives-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Option to go back to Best */}
                                {selectedId !== 'best' && (
                                    <GlassCard
                                        style={{ padding: '1rem', cursor: 'pointer', borderColor: 'var(--geo-neon-blue)' }}
                                        onClick={() => setSelectedId('best')}
                                    >
                                        <div className="alt-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <ScoreBadge score={results.best.score} size="sm" />
                                                <span style={{ fontWeight: 600, color: 'var(--geo-text-primary)' }}>Best Variation</span>
                                                <span className="best-badge" style={{ fontSize: '0.65rem' }}>Top Pick</span>
                                            </div>
                                            <ChevronRight size={18} color="var(--geo-neon-blue)" />
                                        </div>
                                        <p style={{ color: 'var(--geo-text-secondary)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {results.best.content}
                                        </p>
                                    </GlassCard>
                                )}

                                {/* Render Alternatives */}
                                {results.alternatives.map((alt, idx) => {
                                    if (alt.id === selectedId) return null; // Don't show current as alternative

                                    return (
                                        <GlassCard
                                            key={alt.id}
                                            style={{ padding: '1rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                            onClick={() => setSelectedId(alt.id)}
                                        >
                                            <div className="alt-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <ScoreBadge score={alt.score} size="sm" />
                                                    <span style={{ fontWeight: 600, color: 'var(--geo-text-primary)' }}>Variation {idx + 2}</span>
                                                </div>
                                                <ChevronRight size={18} color="var(--geo-text-secondary)" />
                                            </div>
                                            <p style={{ color: 'var(--geo-text-secondary)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {alt.content}
                                            </p>
                                        </GlassCard>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>
            )}

        </section>
    );
};

export default RightPanel;

