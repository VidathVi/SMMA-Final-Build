import React, { useState } from 'react';
import { Sparkles, Upload, X, FileText, Image as ImageIcon, ChevronDown, Sliders } from 'lucide-react';

import GlassCard from './components/ui/GlassCard';
import RunButton from './components/ui/RunButton';
import './LeftPanel.css';

const LeftPanel = ({ formData, setFormData, onRun, isAnalyzing, loadingText }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);


    const handleTextChange = (e) => {
        const value = e.target.value;
        if (value.length <= 1000) {
            setFormData({ ...formData, keyPoints: value });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (!formData.tags.includes(newTag) && formData.tags.length < 5) {
                setFormData({ ...formData, tags: [...formData.tags, newTag] });
            }
            e.target.value = '';
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleAdvancedChange = (key, value) => {
        setFormData({
            ...formData,
            advanced: { ...formData.advanced, [key]: value }
        });
    };


    const handleFileChange = (file) => {
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
            if (validTypes.includes(file.type)) {
                setFormData({ ...formData, attachedFile: file });
            } else {
                alert('Please upload a valid file (Image, PDF, or TXT)');
            }
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const removeFile = () => {
        setFormData({ ...formData, attachedFile: null });
    };

    return (
        <aside className="left-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
            <div className="section-group" style={{
                maxWidth: '850px',
                margin: '0 auto',
                width: '100%'
            }}>
                <div id="geo-engine-config">
                    <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--geo-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Generative Engine Optimization
                    </h3>

                    <GlassCard>
                        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Attached Media</label>
                                {!formData.attachedFile ? (
                                    <div
                                        className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            hidden
                                            onChange={(e) => handleFileChange(e.target.files[0])}
                                        />
                                        <label htmlFor="file-upload" className="upload-content">
                                            <Upload size={24} className="upload-icon" />
                                            <div className="upload-text">
                                                <span className="primary-text">Click to upload or drag & drop</span>
                                                <span className="secondary-text">PDF, TXT, PNG, or JPG (max 10MB)</span>
                                            </div>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="file-preview-card">
                                        <div className="file-info">
                                            {formData.attachedFile.type.startsWith('image/') ? (
                                                <ImageIcon size={20} className="file-icon" />
                                            ) : (
                                                <FileText size={20} className="file-icon" />
                                            )}
                                            <div className="file-details">
                                                <span className="file-name">{formData.attachedFile.name}</span>
                                                <span className="file-size">{(formData.attachedFile.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                        </div>
                                        <button className="remove-file-btn" onClick={removeFile}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="input-group" style={{ marginBottom: 0 }}>
                                <label className="input-label">
                                    Key Points
                                    <button className="ai-icon-btn" title="AI Suggestion">
                                        <Sparkles size={16} />
                                    </button>
                                </label>
                                <div className="textarea-wrapper">
                                    <textarea
                                        className="geo-textarea"
                                        placeholder="Enter the primary messaging or key points for analysis..."
                                        value={formData.keyPoints}
                                        onChange={handleTextChange}
                                    />
                                    <span className="char-counter">
                                        {formData.keyPoints.length}/1000
                                    </span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <div id="campaign-settings-config" style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--geo-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Campaign Settings
                    </h3>
                    <GlassCard shadow="lg">
                        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                            <div className="settings-grid">
                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="input-label">Tags / Keywords (Max 5)</label>
                                    <div className="tags-input-container" onClick={() => document.getElementById('tag-input')?.focus()}>
                                        {formData.tags.length > 0 && (
                                            <div className="tags-list">
                                                {formData.tags.map(tag => (
                                                    <span key={tag} className="geo-tag">
                                                        {tag}
                                                        <button type="button" onClick={() => removeTag(tag)} className="tag-remove-btn">
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <input
                                            id="tag-input"
                                            type="text"
                                            className="tag-input"
                                            placeholder={formData.tags.length < 5 ? "Type keyword " : "Max 5 keywords reached"}
                                            onKeyDown={handleKeyDown}
                                            disabled={formData.tags.length >= 5}
                                        />
                                    </div>
                                </div>

                                <div className="input-group">

                                    <label className="input-label">Target Platform</label>
                                    <select
                                        className="geo-select"
                                        value={formData.platform}
                                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    >
                                        <option value="Instagram">Instagram</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Twitter/X">Twitter/X</option>
                                        <option value="Blog">Blog</option>
                                        <option value="YouTube">YouTube</option>
                                        <option value="Facebook">Facebook</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Tone</label>
                                    <select
                                        className="geo-select"
                                        value={formData.tone}
                                        onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                    >
                                        <option value="Professional">Professional</option>
                                        <option value="Friendly">Friendly</option>
                                        <option value="Humorous">Humorous</option>
                                        <option value="Persuasive">Persuasive</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Inspirational">Inspirational</option>
                                    </select>
                                </div>

                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="input-label">Primary Goal</label>
                                    <select
                                        className="geo-select"
                                        value={formData.goal}
                                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                    >
                                        <option value="Brand Awareness">Brand Awareness</option>
                                        <option value="Engagement">Engagement</option>
                                        <option value="Lead Generation">Lead Generation</option>
                                        <option value="Conversion">Conversion</option>
                                        <option value="Informative">Informative</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <div id="advanced-config" style={{ marginTop: '2rem' }}>
                    <GlassCard>
                        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                            <button
                                className="advanced-toggle"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                style={{ width: '100%', border: 'none', background: 'none' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Sliders size={18} className={showAdvanced ? 'text-neon-blue' : ''} style={{ color: showAdvanced ? 'var(--geo-neon-blue)' : 'var(--geo-text-secondary)' }} />
                                        <span style={{ fontWeight: 600, color: 'var(--geo-text-primary)' }}>Advanced Configuration</span>
                                    </div>
                                    <ChevronDown size={18} className={`toggle-icon ${showAdvanced ? 'open' : ''}`} />
                                </div>
                            </button>

                            {showAdvanced && (
                                <div className="advanced-content">
                                    <div className="range-input-group">
                                        <div className="range-label">
                                            <span>Keyword Density</span>
                                            <span>{formData.advanced.density}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            className="geo-range"
                                            value={formData.advanced.density}
                                            onChange={(e) => handleAdvancedChange('density', e.target.value)}
                                        />
                                    </div>

                                    <div className="range-input-group" style={{ marginTop: '1.5rem' }}>
                                        <div className="range-label">
                                            <span>Creativity Level</span>
                                            <span>{formData.advanced.creativity}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            className="geo-range"
                                            value={formData.advanced.creativity}
                                            onChange={(e) => handleAdvancedChange('creativity', e.target.value)}
                                        />
                                    </div>

                                    <div className="settings-grid" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="input-group" style={{ marginBottom: 0 }}>
                                            <label className="input-label">Target Audience</label>
                                            <select
                                                className="geo-select"
                                                value={formData.advanced.audience}
                                                onChange={(e) => handleAdvancedChange('audience', e.target.value)}
                                            >
                                                <option value="General">General</option>
                                                <option value="Technical">Technical</option>
                                                <option value="Executive">Executive</option>
                                                <option value="Creative">Creative</option>
                                            </select>
                                        </div>
                                        <div className="input-group" style={{ marginBottom: 0 }}>
                                            <label className="input-label">Content Length</label>
                                            <select
                                                className="geo-select"
                                                value={formData.advanced.length}
                                                onChange={(e) => handleAdvancedChange('length', e.target.value)}
                                            >
                                                <option value="Short">Short</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Long">Long</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>

            </div>

            <div className="action-area" style={{
                marginTop: 'auto',
                paddingBottom: '1rem',
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%'
            }}>
                <RunButton
                    onClick={onRun}
                    isAnalyzing={isAnalyzing}
                    disabled={!formData.keyPoints.trim() && !formData.attachedFile}
                    loadingText={loadingText}
                />
            </div>


        </aside>
    );
};



export default LeftPanel;
