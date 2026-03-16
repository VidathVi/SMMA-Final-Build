interface PreviewProps {
    username?: string;
    caption?: string;
    imageUrl?: string;
    mediaType?: 'image' | 'video';
}

export default function FacebookPreview({ username = 'IT Life', caption = '', imageUrl, mediaType = 'image' }: PreviewProps) {
    return (
        <div className="bg-[#242526] rounded-lg overflow-hidden border border-gray-700">
            {/* Profile Header */}
            <div className="p-3 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500"></div>
                    <div className="flex-1">
                        <div className="text-white text-sm font-semibold">{username}</div>
                        <div className="text-gray-400 text-xs">Just now · 🌎</div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="4" r="1.5" />
                            <circle cx="10" cy="10" r="1.5" />
                            <circle cx="10" cy="16" r="1.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Post Text */}
            <div className="p-3 text-sm text-gray-200 leading-relaxed">
                {caption || 'No caption'}
            </div>

            {/* Post Image */}
            <div className="bg-black">
                {imageUrl ? (
                    mediaType === 'video' ? (
                        <video src={imageUrl} controls className="w-full max-h-96 object-contain" />
                    ) : (
                        <img src={imageUrl} alt="Post" className="w-full max-h-96 object-contain" />
                    )
                ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                        <div className="text-center text-white p-8">
                            <div className="text-5xl font-bold mb-2">22</div>
                            <div className="text-sm">February</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Engagement Stats */}
            <div className="px-3 py-2 border-b border-gray-700 flex items-center justify-between text-xs text-gray-400">
                <span>👍 ❤️ 👏 125</span>
                <div className="flex gap-3">
                    <span>23 comments</span>
                    <span>5 shares</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-2 flex items-center justify-around">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-gray-400 text-sm font-medium">Like</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-gray-400 text-sm font-medium">Comment</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-gray-400 text-sm font-medium">Share</span>
                </button>
            </div>
        </div>
    );
}
