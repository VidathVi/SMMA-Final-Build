"use client";

import { useState, useRef } from "react";
import PlatformSelector, { Platform } from "@/components/PlatformSelector";
import InstagramPreview from "@/components/previews/InstagramPreview";
import FacebookPreview from "@/components/previews/FacebookPreview";
import TwitterPreview from "@/components/previews/TwitterPreview";
import TikTokPreview from "@/components/previews/TikTokPreview";
import YouTubePreview from "@/components/previews/YouTubePreview";
import WhatsAppPreview from "@/components/previews/WhatsAppPreview";
import TelegramPreview from "@/components/previews/TelegramPreview";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] =
    useState<Platform>("facebook");
  const [postCaption, setPostCaption] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet quam convallis sem volutpat fringilla.",
  );

  const [mediaFiles, setMediaFiles] = useState<
    { file: File; url: string; type: "image" | "video" }[]
  >([]);
  const MAX_MEDIA_LIMIT = 6;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      const remainingSlots = MAX_MEDIA_LIMIT - mediaFiles.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);

      const newMediaObjects = filesToAdd.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/")
          ? ("video" as const)
          : ("image" as const),
      }));

      setMediaFiles((prev) => [...prev, ...newMediaObjects]);
    }
    // Reset input so the same file could be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeMedia = (indexToRemove: number) => {
    setMediaFiles((prev) => {
      const newMedia = [...prev];
      URL.revokeObjectURL(newMedia[indexToRemove].url); // Clean up memory
      newMedia.splice(indexToRemove, 1);
      return newMedia;
    });
  };

  const renderPreview = () => {
    const props = {
      caption: postCaption,
      // Pass the first media file to the preview
      imageUrl: mediaFiles.length > 0 ? mediaFiles[0].url : undefined,
      mediaType: mediaFiles.length > 0 ? mediaFiles[0].type : undefined,
    };

    switch (selectedPlatform) {
      case "instagram":
        return <InstagramPreview {...props} />;
      case "facebook":
        return <FacebookPreview {...props} />;
      case "twitter":
        return <TwitterPreview {...props} />;
      case "tiktok":
        return <TikTokPreview {...props} />;
      case "youtube":
        return <YouTubePreview {...props} title={postCaption.split("\n")[0]} />;
      case "whatsapp":
        return <WhatsAppPreview {...props} />;
      case "telegram":
        return <TelegramPreview {...props} />;
      default:
        return <InstagramPreview {...props} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-[#020617] via-[#0A0A3C] to-[#020024] bg-[length:300%_300%] animate-gradient text-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex w-full max-w-6xl gap-8 relative p-8">
        {/* Main Content Area - Create Post */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Create Post Header & Inputs */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden ">
            <h2 className="text-xl font-semibold text-white ">Create Post</h2>
            <br />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 ml-4">
                  <span>Sharing to:</span>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer relative group">
                      <input
                        type="checkbox"
                        name="facebook"
                        className="peer sr-only "
                      />
                      <div className="w-8 h-8 rounded-full bg-black/20 border border-white/10 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100 peer-checked:bg-[#1877F2] peer-checked:border-[#1877F2]">
                        <FaFacebookF className="w-4 h-4 text-white" />
                      </div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input
                        type="checkbox"
                        name="instagram"
                        className="peer sr-only"
                        defaultChecked
                      />
                      <div className="w-8 h-8 rounded-full bg-black/20 border border-white/10 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100 peer-checked:bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] peer-checked:border-transparent">
                        <FaInstagram className="w-4 h-4 text-white" />
                      </div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input
                        type="checkbox"
                        name="tiktok"
                        className="peer sr-only"
                      />
                      <div className="w-8 h-8 rounded-full bg-black/20 border border-white/10 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100 peer-checked:bg-black peer-checked:border-white">
                        <FaTiktok className="w-4 h-4 text-white" />
                      </div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input
                        type="checkbox"
                        name="twitter"
                        className="peer sr-only"
                        defaultChecked
                      />
                      <div className="w-8 h-8 rounded-full bg-black/20 border border-white/10 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100 peer-checked:bg-[#1DA1F2] peer-checked:border-[#1DA1F2]">
                        <FaTwitter className="w-4 h-4 text-white" />
                      </div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input
                        type="checkbox"
                        name="whatsapp"
                        className="peer sr-only"
                        defaultChecked
                      />
                      <div className="w-8 h-8 rounded-full bg-black/20 border border-white/10 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100 peer-checked:bg-[#25D366] peer-checked:border-[#25D366]">
                        <FaWhatsapp className="w-4 h-4 text-white" />
                      </div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input
                        type="checkbox"
                        name="youtube"
                        className="peer sr-only"
                        defaultChecked
                      />
                      <div className="w-8 h-8 rounded-full bg-black/20 border border-white/10 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100 peer-checked:bg-[#FF0000] peer-checked:border-[#FF0000]">
                        <FaYoutube className="w-4 h-4 text-white" />
                      </div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input
                        type="checkbox"
                        name="telegram"
                        className="peer sr-only"
                        defaultChecked
                      />
                      <div className="w-8 h-8 rounded-full bg-black/20 border border-white/10 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100 peer-checked:bg-[#0088cc] peer-checked:border-[#0088cc]">
                        <FaTelegramPlane className="w-4 h-4 text-white" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* description area */}
            <textarea
              className="w-full h-32 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-gray-300 text-sm mb-4 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              placeholder="Describe the post for optimization"
              value={postCaption}
              onChange={(e) => setPostCaption(e.target.value)}
            />
          </div>

          {/* Content Uploader */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-h-48 flex flex-col justify-center">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Media Previews */}
              {mediaFiles.map((media, index) => (
                <div
                  key={media.url}
                  className="h-32 w-32 bg-black/20 rounded-lg overflow-hidden relative group border border-white/10"
                >
                  {media.type === "video" ? (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Remove Button */}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove media"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {mediaFiles.length < MAX_MEDIA_LIMIT && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 w-32 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-400 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <svg
                    className="w-8 h-8 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-xs text-center px-2">
                    Add Media
                    <br />({mediaFiles.length}/{MAX_MEDIA_LIMIT})
                  </span>
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              multiple
              className="hidden"
            />
          </div>

          {/* Posting Schedule */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">
                Posting Schedule
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    className="w-5 h-5 accent-blue-500 bg-transparent"
                    defaultChecked
                  />
                  <span className="text-gray-300">Post Now</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    className="w-5 h-5 accent-blue-500 bg-transparent"
                  />
                  <span className="text-gray-300">Schedule</span>
                  <span className="ml-auto text-gray-500 text-sm">
                    --/--/--
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    className="w-5 h-5 accent-blue-500 bg-transparent"
                  />
                  <span className="text-gray-300">Add to Queue</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    className="w-5 h-5 accent-blue-500 bg-transparent"
                  />
                  <span className="text-gray-300">Add to Content Category</span>
                </label>
              </div>

              <div className="mt-6">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                  Publish Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="hidden lg:block w-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Preview</h3>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </div>

          {/* Platform Selector */}
          <PlatformSelector
            selectedPlatform={selectedPlatform}
            onSelectPlatform={setSelectedPlatform}
          />

          {/* Dynamic Platform Preview */}
          <div className="transition-all duration-300 ease-in-out">
            {renderPreview()}
          </div>
        </div>
      </main>
    </div>
  );
}
