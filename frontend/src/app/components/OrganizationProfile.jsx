import { useState, useRef } from "react";
import { Lock, Camera } from "lucide-react";

export default function OrganizationProfile({ org, onUpdate }) {
    const fileInputRef = useRef(null);
    const [isAdmin] = useState(true); // Mock admin status

    const handleChange = (e) => {
        onUpdate(e.target.name, e.target.value);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            onUpdate("avatar", imageUrl);
        }
    };

    return (
        <div className="profile-section">
            <h1 className="page-title">Organization</h1>
            <p className="page-subtitle">Manage your organization settings</p>

            {/* Organization Info */}
            <div className="profile-card" style={{ marginBottom: "40px" }}>
                <div className="left-column">
                    <h3 className="section-title">Organization Info</h3>
                    <div className="avatar-wrapper">
                        <img src={org.avatar} alt="Org Logo" className="avatar-lg" style={{ padding: '20px', background: 'var(--bg-dark)' }} />
                        {isAdmin && (
                            <button
                                className="camera-btn"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <Camera size={18} />
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            hidden
                            accept="image/*"
                        />
                    </div>
                    <p className="upload-text">JPG / PNG • Max 5MB</p>
                </div>

                <div className="right-column">
                    <div className="form-group">
                        <div className="form-row">
                            <div className="form-col">
                                <label>Organization name</label>
                                <input
                                    name="name"
                                    value={org.name}
                                    onChange={handleChange}
                                    disabled={!isAdmin}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-col">
                                <label>Industry</label>
                                <select
                                    name="industry"
                                    value={org.industry}
                                    onChange={handleChange}
                                    disabled={!isAdmin}
                                >
                                    <option>SaaS</option>
                                    <option>EduTech</option>
                                    <option>FinTech</option>
                                    <option>Health</option>
                                </select>
                            </div>
                            <div className="form-col">
                                <label>Website</label>
                                <div className="input-with-icon">
                                    <input
                                        name="website"
                                        value={org.website}
                                        onChange={handleChange}
                                        disabled={!isAdmin}
                                    />
                                    {!isAdmin && <Lock size={16} className="input-icon-right" />}
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-col">
                                <label>Country / region</label>
                                <select
                                    name="country"
                                    value={org.country}
                                    onChange={handleChange}
                                    disabled={!isAdmin}
                                >
                                    <option>Sri Lanka</option>
                                    <option>Singapore</option>
                                    <option>USA</option>
                                </select>
                            </div>
                            <div className="form-col">
                                <label>Subscription plan</label>
                                <div className="input-with-icon">
                                    <input value={org.plan} disabled />
                                    <Lock size={16} className="input-icon-right" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isAdmin && (
                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                            <Lock size={16} />
                            <span>Only organization admins can edit this section.</span>
                        </div>
                    )}

                    {isAdmin && (
                        <div className="form-actions">
                            <button className="btn btn-primary">Save Changes</button>
                            <button className="btn btn-secondary">Cancel</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Team & Roles */}
            <h3 className="section-title">Team & Roles</h3>

            {/* Admin Role */}
            <div className="profile-card" style={{ marginBottom: "20px", padding: "24px", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span className="badge active" style={{ fontSize: '14px', marginBottom: '8px', display: 'inline-block' }}>Admin</span>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Full Access</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="badge active">Manage Users</span>
                        <span className="badge active">Billing</span>
                        <span className="badge active">Settings</span>
                    </div>
                </div>
            </div>

            {/* Manager Role */}
            <div className="profile-card" style={{ marginBottom: "20px", padding: "24px", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span className="badge" style={{ fontSize: '14px', marginBottom: '8px', display: 'inline-block' }}>Manager</span>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Campaign Management</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="badge active">Create Campaigns</span>
                        <span className="badge active">Approve Content</span>
                        <span className="badge">Invite Users</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
