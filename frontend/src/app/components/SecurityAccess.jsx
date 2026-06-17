import { useState } from "react";
import { Lock, Smartphone, Laptop } from "lucide-react";

export default function SecurityAccess() {
    const [twoFactor, setTwoFactor] = useState(false);
    const [autoEscalate, setAutoEscalate] = useState(true);

    return (
        <div className="profile-section">
            <h1 className="page-title">Security & Access</h1>
            <p className="page-subtitle">Manage your login, verification sessions & AI rules</p>

            {/* Login & Security */}
            <h3 className="section-title">Login & Security</h3>
            <div className="profile-card" style={{ marginBottom: "40px", flexDirection: "column", gap: "24px" }}>
                <div className="form-group">
                    <label>Work Email</label>
                    <div className="input-with-icon">
                        <input value="josie.smith@example.com" disabled />
                        <button className="btn btn-secondary" style={{ position: 'absolute', right: '4px', top: '8px', padding: '6px 16px', fontSize: '12px' }}>
                            Change Password
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--input-bg)' }}>
                    <div>
                        <p style={{ fontWeight: 500, marginBottom: '4px' }}>Two-Factor Authentication (2FA)</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Secure your account with an additional layer of protection.</p>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={twoFactor}
                            onChange={() => setTwoFactor(!twoFactor)}
                            style={{ width: 'auto', margin: 0 }}
                        />
                        <span style={{ marginLeft: '8px' }}>{twoFactor ? 'On' : 'Off'}</span>
                    </label>
                </div>
            </div>

            {/* Active Sessions */}
            <h3 className="section-title">Active Sessions</h3>
            <div className="profile-card" style={{ marginBottom: "40px", flexDirection: "column", padding: '24px', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Laptop size={24} color="var(--accent-gold)" />
                        <div>
                            <p style={{ fontWeight: 500 }}>Windows PC - Chrome</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Colombo, Sri Lanka • Active now</p>
                        </div>
                    </div>
                    <span className="badge active">Current Device</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Smartphone size={24} color="var(--text-muted)" />
                        <div>
                            <p style={{ fontWeight: 500 }}>iPhone 14 - Safari</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Colombo, Sri Lanka • 2 hours ago</p>
                        </div>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '12px' }}>
                        Revoke
                    </button>
                </div>

                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }}>
                    Logout from all devices
                </button>
            </div>

            {/* AI Escalation Rules */}
            <h3 className="section-title">AI Escalation Rules</h3>
            <div className="profile-card" style={{ flexDirection: "column", gap: "24px" }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--input-bg)' }}>
                    <div>
                        <p style={{ fontWeight: 500, marginBottom: '4px' }}>Auto-escalate sensitive messages</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Automatically flag high-risk content for human review.</p>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={autoEscalate}
                            onChange={() => setAutoEscalate(!autoEscalate)}
                            style={{ width: 'auto', margin: 0 }}
                        />
                        <span style={{ marginLeft: '8px' }}>{autoEscalate ? 'On' : 'Off'}</span>
                    </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--input-bg)' }}>
                    <div>
                        <p style={{ fontWeight: 500, marginBottom: '4px' }}>Escalate when AI confidence is low</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>If confidence drops below 70%, request manual approval.</p>
                    </div>
                    <span className="badge">Read-only (Org Policy)</span>
                </div>

                <div className="form-actions">
                    <button className="btn btn-primary">Save Changes</button>
                    <button className="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
}
