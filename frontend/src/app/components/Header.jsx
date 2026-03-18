import { Mail, Bell, ChevronLeft, HelpCircle } from "lucide-react";

export default function Header({ userAvatar, breadcrumbs, onBack }) {
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    return (
        <header className="top-header">
            <div className="header-left">
                <button className="back-btn" onClick={handleBack} aria-label="Go back">
                    <ChevronLeft size={24} />
                </button>
                <div className="breadcrumbs">
                    {breadcrumbs}
                </div>
            </div>
            <div className="header-actions">
                <button className="icon-btn" aria-label="Help">
                    <HelpCircle size={24} />
                </button>
                <button className="icon-btn" aria-label="Messages">
                    <Mail size={20} />
                </button>
                <button className="icon-btn" aria-label="Notifications">
                    <Bell size={20} />
                </button>
                <img src={userAvatar || "/avatar-placeholder.png"} alt="User" className="user-avatar-sm" />
            </div>
        </header>
    );
}
