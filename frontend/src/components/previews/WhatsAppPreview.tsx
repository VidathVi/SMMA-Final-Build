interface PreviewProps {
  caption?: string;
  imageUrl?: string;
  mediaType?: "image" | "video";
}

export default function WhatsAppPreview({
  caption = "",
  imageUrl,
  mediaType = "image",
}: PreviewProps) {
  return (
    <div className="bg-[#0b141a] rounded-lg overflow-hidden border border-gray-800 p-4">
      {/* Chat Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-teal-500"></div>
        <div className="flex-1">
          <div className="text-white text-sm font-semibold">IIT Life</div>
          <div className="text-gray-400 text-xs">online</div>
        </div>
      </div>

      {/* Message Container */}
      <div className="flex justify-end">
        <div className="max-w-[85%]">
          {/* Message Bubble */}
          <div className="bg-[#005c4b] rounded-lg rounded-tr-none overflow-hidden">
            {/* Image in message */}
            {imageUrl ? (
              mediaType === "video" ? (
                <video
                  src={imageUrl}
                  controls
                  className="w-full max-h-64 object-cover"
                />
              ) : (
                <img
                  src={imageUrl}
                  alt="WhatsApp"
                  className="w-full max-h-64 object-cover"
                />
              )
            ) : (
              <div className="aspect-square bg-gradient-to-br from-green-900 to-teal-900 flex items-center justify-center max-h-64">
                <div className="text-center text-white p-8">
                  <div className="text-5xl font-bold mb-2">22</div>
                  <div className="text-sm">February</div>
                </div>
              </div>
            )}

            {/* Caption below image */}
            {caption && (
              <div className="p-2 text-white text-sm leading-relaxed">
                {caption}
              </div>
            )}

            {/* Time and Status */}
            <div className="px-2 pb-1 flex items-center justify-end gap-1">
              <span className="text-xs text-gray-300">3:45 PM</span>
              <svg
                className="w-4 h-4 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M0 12.116l2.053-1.897c2.401 1.162 3.924 2.045 6.622 3.969 5.073-5.757 8.426-8.678 14.657-12.555l.668 1.536c-5.139 4.484-8.902 9.479-14.321 19.198-3.343-3.936-5.574-6.446-9.679-10.251z" />
              </svg>
              <svg
                className="w-4 h-4 text-blue-400 -ml-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M0 12.116l2.053-1.897c2.401 1.162 3.924 2.045 6.622 3.969 5.073-5.757 8.426-8.678 14.657-12.555l.668 1.536c-5.139 4.484-8.902 9.479-14.321 19.198-3.343-3.936-5.574-6.446-9.679-10.251z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Typing Indicator */}
      <div className="mt-4 pt-3 border-t border-gray-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 bg-[#1e2a30] text-gray-400 text-sm px-4 py-2 rounded-full outline-none"
          disabled
        />
        <button className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
