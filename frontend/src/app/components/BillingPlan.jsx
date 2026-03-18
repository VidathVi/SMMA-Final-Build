export default function BillingPlan() {
    const isAdmin = true; // Mock

    if (!isAdmin) return (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <h2>Access Restricted</h2>
            <p>Only organization administrators can view billing details.</p>
        </div>
    );

    return (
        <div className="profile-section">
            <h1 className="page-title">Billing & Plan</h1>
            <p className="page-subtitle">Manage your subscription and usage</p>

            <div className="profile-card" style={{ flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--accent-gold)' }}>Pro Scale Plan</h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>$49/month • Billed annually</p>
                        <p style={{ color: 'var(--text-primary)', marginTop: '4px' }}>Next renewal: <strong>Aug 14, 2026</strong></p>
                    </div>
                    <button className="btn btn-primary" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)' }}>
                        Update Payment Method
                    </button>
                </div>

                <div style={{ margin: '10px 0', height: '1px', background: 'var(--border-color)' }}></div>

                <h3 className="section-title" style={{ fontSize: '18px', marginBottom: '8px' }}>Usage Limits</h3>

                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Monthly Active Users</span>
                        <span>8 / 20</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: '40%' }}></div>
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>AI Text Generations</span>
                        <span>4,500 / 100,000</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: '4.5%' }}></div>
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Storage</span>
                        <span>12GB / 50GB</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: '24%' }}></div>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn btn-primary">Upgrade Plan</button>
                    <button className="btn btn-secondary">Download Invoices</button>
                </div>
            </div>
        </div>
    );
}
