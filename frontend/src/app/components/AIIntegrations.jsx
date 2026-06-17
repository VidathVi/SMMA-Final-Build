import { useState } from "react";
import { CheckCircle, AlertCircle, RefreshCw, Lock } from "lucide-react";

export default function AIIntegrations() {
    const [level, setLevel] = useState("Pro");

    const platforms = [
        {
            name: 'Facebook', status: 'Connected', iconColor: '#1877F2', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            )
        },
        {
            name: 'Instagram', status: 'Connected', iconColor: '#E1306C', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M18,5A1.5,1.5 0 0,1 19.5,6.5A1.5,1.5 0 0,1 18,8A1.5,1.5 0 0,1 16.5,6.5A1.5,1.5 0 0,1 18,5Z"></path></svg>
            )
        },
        {
            name: 'LinkedIn', status: 'Expired', iconColor: '#0A66C2', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            )
        },
        {
            name: 'WhatsApp', status: 'Connected', iconColor: '#25D366', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
            )
        },
        {
            name: 'YouTube', status: 'Needs re-auth', iconColor: '#FF0000', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            )
        },
        {
            name: 'TikTok', status: 'Connected', iconColor: '#000000', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
            )
        },
        {
            name: 'X (Twitter)', status: 'Connected', iconColor: '#000000', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            )
        },
    ];

    return (
        <div className="profile-section">
            <h1 className="page-title">AI & Integrations</h1>
            <p className="page-subtitle">Manage your AI settings and connected platforms</p>

            {/* AI Usage & Preferences */}
            <h3 className="section-title">AI Usage & Preferences</h3>
            <div className="profile-card" style={{ marginBottom: "40px", flexDirection: "column", gap: "32px" }}>

                <div className="form-row" style={{ alignItems: 'flex-start' }}>
                    <div className="form-col">
                        <label>AI Access Level</label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button
                                className={`btn ${level === 'Basic' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setLevel('Basic')}
                                style={{ padding: '8px 24px' }}
                            >
                                Basic
                            </button>
                            <button
                                className={`btn ${level === 'Pro' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setLevel('Pro')}
                                style={{ padding: '8px 24px' }}
                            >
                                Pro
                            </button>
                        </div>
                        <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                            Unlocks premium content generation and advanced analytics.
                        </p>
                    </div>

                    <div className="form-col">
                        <label>Monthly AI credit usage</label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                            <span>4,500 credits used</span>
                            <span style={{ color: 'var(--text-muted)' }}>Limit: 10,000</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="form-row" style={{ marginBottom: '0px' }}>
                    <div className="form-col">
                        <label>Brand tone adherence</label>
                        <div className="input-with-icon">
                            <input value="Professional & Engaging" disabled />
                            <Lock size={16} className="input-icon-right" />
                        </div>
                        <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                            Controlled by organization settings
                        </p>
                    </div>
                    <div className="form-col">
                        <label>Preferred response language</label>
                        <select>
                            <option>English</option>
                            <option>Sinhala</option>
                            <option>Tamil</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions" style={{ paddingTop: '10px' }}>
                    <button className="btn btn-primary">Save Changes</button>
                    <button className="btn btn-secondary">Cancel</button>
                </div>
            </div>

            {/* Connected Platforms */}
            <h3 className="section-title">Connected Platforms</h3>
            <div className="profile-card" style={{ flexDirection: "column", gap: "16px", padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {platforms.map(platform => (
                        <div key={platform.name} style={{
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--input-bg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    backgroundColor: platform.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {platform.icon}
                                </span>
                                <span style={{ fontWeight: 500 }}>{platform.name}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                                {platform.status === 'Connected' && <CheckCircle size={16} color="#10B981" />}
                                {platform.status === 'expired' && <AlertCircle size={16} color="#F59E0B" />}
                                {platform.status === 'Needs re-auth' && <RefreshCw size={16} color="#EF4444" />}

                                <span style={{
                                    color: platform.status === 'Connected' ? '#10B981' :
                                        platform.status === 'Expired' ? '#F59E0B' : '#EF4444'
                                }}>
                                    {platform.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
