import { AlertTriangle } from "lucide-react";

export default function DangerZone() {
    return (
        <div className="profile-section">
            <h1 className="page-title" style={{ color: 'var(--text-primary)' }}>Danger Zone</h1>
            <p className="page-subtitle">Proceed with caution</p>

            <div className="profile-card" style={{ flexDirection: 'column', gap: '24px' }}>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: '#834148ff', borderRadius: '8px' }}>
                    <AlertTriangle color="#ffffffff" size={24} style={{ flexShrink: 0 }} />
                    <div>
                        <h4 style={{ color: '#f9f4f4ff', marginBottom: '4px', fontWeight: 600 }}>Proceed with Caution</h4>
                        <p style={{ fontSize: '14px', color: '#f9f4f4ff' }}>
                            These actions will have permanent consequences. Please be certain before continuing.
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                        <div>
                            <p style={{ fontWeight: 500 }}>Leave Organization</p>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Revoke your access to this organization.</p>
                        </div>
                        <button className="btn btn-secondary" style={{ border: '2px solid #720909ff', color: '#FFFFFF' }}>
                            Leave Organization
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                        <div>
                            <p style={{ fontWeight: 500 }}>Deactivate Account</p>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Disable your account until you reactivate it.</p>
                        </div>
                        <button className="btn btn-secondary" style={{ border: '2px solid #720909ff', color: '#FFFFFF' }}>
                            Deactivate Account
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                        <div>
                            <p style={{ fontWeight: 500 }}>Delete Organization (Admin only)</p>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Permanently delete this organization and all data.</p>
                        </div>
                        <button className="btn btn-secondary" style={{ backgroundColor: '#961212ff', color: '#FFFFFF', border: 'none' }}>
                            Delete Organization
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
