'use client';

import { ReactNode } from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaTwitter, FaWhatsapp, FaYoutube, FaTelegramPlane } from 'react-icons/fa';

export type Platform = 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'youtube' | 'whatsapp' | 'telegram';

interface PlatformSelectorProps {
    selectedPlatform: Platform;
    onSelectPlatform: (platform: Platform) => void;
}

const platforms: { id: Platform; label: string; icon: ReactNode }[] = [
    { id: 'instagram', label: 'Instagram', icon: <FaInstagram /> },
    { id: 'facebook', label: 'Facebook', icon: <FaFacebookF /> },
    { id: 'twitter', label: 'Twitter', icon: <FaTwitter /> },
    { id: 'tiktok', label: 'TikTok', icon: <FaTiktok /> },
    { id: 'youtube', label: 'YouTube', icon: <FaYoutube /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <FaWhatsapp /> },
    { id: 'telegram', label: 'Telegram', icon: <FaTelegramPlane /> },
];

export default function PlatformSelector({ selectedPlatform, onSelectPlatform }: PlatformSelectorProps) {
    return (
        <div className="flex items-center gap-2 mb-4 pb-2 flex-wrap">
            {platforms.map((platform) => (
                <button
                    key={platform.id}
                    onClick={() => onSelectPlatform(platform.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedPlatform === platform.id
                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                        }`}
                >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedPlatform === platform.id ? 'bg-white/20' : 'bg-gray-700'
                        }`}>
                        {platform.icon}
                    </span>
                    <span>{platform.label}</span>
                </button>
            ))}
        </div>
    );
}
