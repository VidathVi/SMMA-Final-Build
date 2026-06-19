interface PreviewProps {
  username?: string;
  caption?: string;
  imageUrl?: string;
  mediaType?: "image" | "video";
}

export default function TikTokPreview({
  username = "@iitlife",
  caption = "",
  imageUrl,
  mediaType = "image",
}: PreviewProps) {
  return (
    <div className="bg-black rounded-lg overflow-hidden border border-gray-800 relative">
      {/* Vertical Video Container */}
      <div className="aspect-[9/16] bg-gradient-to-br from-pink-900 via-purple-900 to-blue-900 relative">
        {imageUrl ? (
          mediaType === "video" ? (
            <video
              src={imageUrl}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={imageUrl}
              alt="TikTok"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="text-6xl font-bold mb-2">22</div>
              <div className="text-sm">February</div>
            </div>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="absolute right-2 bottom-20 flex flex-col gap-4 items-center">
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 flex items-center justify-center border-2 border-white">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </button>

          <button className="flex flex-col items-center gap-1">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-white text-xs font-bold">234K</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            <span className="text-white text-xs font-bold">1.2K</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span className="text-white text-xs font-bold">567</span>
          </button>

          <button className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 rotate-12 animate-spin-slow"></button>
        </div>

        {/* Bottom Caption Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white font-bold text-sm">{username}</span>
            <button className="px-4 py-1 rounded bg-pink-600 text-white text-xs font-bold">
              Follow
            </button>
          </div>
          <div className="text-white text-xs leading-relaxed line-clamp-3">
            {caption || "No caption"}
          </div>
        </div>
      </div>
    </div>
  );
}
