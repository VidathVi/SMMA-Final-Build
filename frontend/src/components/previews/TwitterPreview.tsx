interface PreviewProps {
  username?: string;
  displayName?: string;
  caption?: string;
  imageUrl?: string;
  mediaType?: "image" | "video";
}

export default function TwitterPreview({
  username = "iitlife",
  displayName = "IIT Life",
  caption = "",
  imageUrl,
  mediaType = "image",
}: PreviewProps) {
  return (
    <div className="bg-black rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4">
        {/* Profile Header */}
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex-shrink-0"></div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-sm">
                {displayName}
              </span>
              <svg
                className="w-4 h-4 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-500 text-sm">@{username}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 text-sm">2m</span>
            </div>

            {/* Tweet Text */}
            <div className="text-white text-sm mt-1 leading-relaxed">
              {caption || "No caption"}
            </div>

            {/* Tweet Image */}
            {imageUrl ? (
              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800">
                {mediaType === "video" ? (
                  <video
                    src={imageUrl}
                    controls
                    className="w-full max-h-96 object-cover"
                  />
                ) : (
                  <img
                    src={imageUrl}
                    alt="Tweet"
                    className="w-full max-h-96 object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="mt-3 aspect-video bg-gradient-to-br from-blue-900 to-cyan-900 rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-5xl font-bold mb-2">22</div>
                  <div className="text-sm">February</div>
                </div>
              </div>
            )}

            {/* Engagement Stats */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
              <span>3:45 PM</span>
              <span>·</span>
              <span>Feb 16, 2026</span>
              <span>·</span>
              <span className="font-bold text-white">2.5K</span> Views
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors group">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="text-xs">45</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-green-400 transition-colors group">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-xs">12</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors group">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-xs">234</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
