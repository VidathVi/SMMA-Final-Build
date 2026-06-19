interface PreviewProps {
  username?: string;
  caption?: string;
  imageUrl?: string;
  mediaType?: "image" | "video";
}

export default function InstagramPreview({
  username = "itlife",
  caption = "",
  imageUrl,
  mediaType = "image",
}: PreviewProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-700">
      {/* Preview Header */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-800">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-[#1a1a1a]"></div>
        </div>
        <span className="text-white text-sm font-medium">{username}</span>
        <svg className="w-1 h-1 fill-gray-500 ml-auto" viewBox="0 0 4 4">
          <circle cx="2" cy="2" r="2" />
        </svg>
        <svg className="w-1 h-1 fill-gray-500" viewBox="0 0 4 4">
          <circle cx="2" cy="2" r="2" />
        </svg>
        <svg className="w-1 h-1 fill-gray-500" viewBox="0 0 4 4">
          <circle cx="2" cy="2" r="2" />
        </svg>
      </div>

      {/* Post Image */}
      <div className="aspect-square bg-gradient-to-br from-red-900 to-orange-800 relative flex items-center justify-center">
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
              alt="Post"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="text-center text-white p-8">
            <div className="text-6xl font-bold mb-2">22</div>
            <div className="text-sm">February</div>
          </div>
        )}
      </div>

      {/* Engagement Icons */}
      <div className="flex items-center gap-4 p-3 border-b border-gray-800">
        <svg
          className="w-6 h-6 text-white"
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
        <svg
          className="w-6 h-6 text-white"
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
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        <svg
          className="w-6 h-6 text-white ml-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </div>

      {/* Caption */}
      <div className="p-3 text-xs text-gray-300 leading-relaxed">
        <span className="font-semibold text-white">{username}</span>{" "}
        {caption || "No caption"}
      </div>
    </div>
  );
}
