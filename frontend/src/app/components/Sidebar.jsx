import {
    User,
    Building2,
    Bot,
    Lock,
    CreditCard,
    AlertTriangle
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: 'personal', label: 'Personal Profile', icon: User },
        { id: 'organization', label: 'Organization', icon: Building2 },
        { id: 'ai', label: 'AI & Integrations', icon: Bot },
        { id: 'security', label: 'Security & Access', icon: Lock },
        { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    ];

    return (
        <aside className="sidebar">
            <nav style={{ marginTop: '0px' }}>
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </div>
                ))}

                <div style={{ margin: '20px 0', height: '1px', background: 'var(--border-color)' }}></div>
                <p style={{ padding: '0 12px 12px', fontSize: '20px', color: 'var(--text-muted)' }}>Admin Only</p>

                <div
                    onClick={() => setActiveTab('danger')}
                    className={`nav-item danger ${activeTab === 'danger' ? "active" : ""}`}
                >
                    <AlertTriangle size={20} />
                    <span>Danger Zone</span>
                </div>
            </nav>
        </aside>
    );
}
