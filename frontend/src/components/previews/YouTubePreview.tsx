interface PreviewProps {
  channelName?: string;
  title?: string;
  caption?: string;
  imageUrl?: string;
  mediaType?: "image" | "video";
}

export default function YouTubePreview({
  channelName = "IIT Life",
  title = "",
  caption = "",
  imageUrl,
  mediaType = "image",
}: PreviewProps) {
  return (
    <div className="bg-[#0f0f0f] rounded-lg overflow-hidden border border-gray-800">
      {/* Video Thumbnail */}
      <div className="relative">
        {imageUrl ? (
          <div className="aspect-video relative">
            {mediaType === "video" ? (
              <video
                src={imageUrl}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={imageUrl}
                alt="YouTube"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-1 py-0.5 rounded">
              10:24
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-red-900 to-pink-900 flex items-center justify-center relative">
            <div className="text-center text-white p-8">
              <div className="text-5xl font-bold mb-2">22</div>
              <div className="text-sm">February</div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-1 py-0.5 rounded">
              10:24
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-3">
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-500 to-pink-500 flex-shrink-0"></div>

          <div className="flex-1 min-w-0">
            {/* Video Title */}
            <h3 className="text-white text-sm font-medium line-clamp-2 leading-snug mb-1">
              {title || caption || "No title"}
            </h3>

            {/* Channel Info */}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className="font-medium">{channelName}</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>

            {/* Video Stats */}
            <div className="text-xs text-gray-400 mt-0.5">
              125K views · 2 hours ago
            </div>
          </div>

          {/* More Options */}
          <button className="text-white hover:text-gray-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        </div>

        {/* Description Preview */}
        {caption && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {caption}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
          <button className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span className="text-white text-xs font-medium">2.3K</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
              />
            </svg>
          </button>
          <button className="ml-auto px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-full transition-colors">
            <span className="text-white text-xs font-bold">SUBSCRIBE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
