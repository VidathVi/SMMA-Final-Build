interface PreviewProps {
    channelName?: string;
    caption?: string;
    imageUrl?: string;
    mediaType?: 'image' | 'video';
}

export default function TelegramPreview({ channelName = 'IT Life', caption = '', imageUrl, mediaType = 'image' }: PreviewProps) {
    return (
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-gray-800">
            {/* Channel Header */}
            <div className="flex items-center gap-2 p-3 border-b border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.756 8.276c-.132.593-.482.741-.977.461l-2.7-1.988-1.3 1.252c-.144.144-.265.265-.544.265l.194-2.759 5.021-4.538c.218-.194-.048-.302-.339-.108l-6.206 3.908-2.677-.839c-.582-.182-.595-.582.122-.862l10.47-4.036c.485-.182.91.108.752.862z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <div className="text-white text-sm font-semibold">{channelName}</div>
                    <div className="text-gray-400 text-xs">Channel</div>
                </div>
                <button className="text-gray-400 hover:text-gray-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                    </svg>
                </button>
            </div>

            {/* Post Content */}
            <div className="p-4">
                {/* Post Image */}
                {imageUrl ? (
                    <div className="rounded-lg overflow-hidden mb-3">
                        {mediaType === 'video' ? (
                            <video src={imageUrl} controls className="w-full max-h-80 object-cover" />
                        ) : (
                            <img src={imageUrl} alt="Telegram" className="w-full max-h-80 object-cover" />
                        )}
                    </div>
                ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-900 to-cyan-900 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                        <div className="text-center text-white p-8">
                            <div className="text-5xl font-bold mb-2">22</div>
                            <div className="text-sm">February</div>
                        </div>
                    </div>
                )}

                {/* Post Text */}
                <div className="text-white text-sm leading-relaxed mb-3">
                    {caption || 'No caption'}
                </div>

                {/* Post Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            12.5K
                        </span>
                    </div>
                    <span>3:45 PM</span>
                </div>
            </div>

            {/* Reaction Bar */}
            <div className="px-4 pb-3 flex items-center gap-1">
                <div className="flex items-center bg-gray-800/50 rounded-full px-2 py-1">
                    <span className="text-sm">❤️</span>
                    <span className="text-xs text-gray-400 ml-1">234</span>
                </div>
                <div className="flex items-center bg-gray-800/50 rounded-full px-2 py-1">
                    <span className="text-sm">🔥</span>
                    <span className="text-xs text-gray-400 ml-1">89</span>
                </div>
                <div className="flex items-center bg-gray-800/50 rounded-full px-2 py-1">
                    <span className="text-sm">👏</span>
                    <span className="text-xs text-gray-400 ml-1">45</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex border-t border-gray-800">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-400 hover:bg-gray-800/30 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-sm">Share</span>
                </button>
            </div>
        </div>
    );
}
