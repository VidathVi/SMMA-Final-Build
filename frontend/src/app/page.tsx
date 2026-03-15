'use client';

import { useState } from 'react';
import PlatformSelector, { Platform } from '@/components/PlatformSelector';
import InstagramPreview from '@/components/previews/InstagramPreview';
import FacebookPreview from '@/components/previews/FacebookPreview';
import TwitterPreview from '@/components/previews/TwitterPreview';
import TikTokPreview from '@/components/previews/TikTokPreview';
import YouTubePreview from '@/components/previews/YouTubePreview';
import WhatsAppPreview from '@/components/previews/WhatsAppPreview';
import TelegramPreview from '@/components/previews/TelegramPreview';

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [postCaption, setPostCaption] = useState("When the magic can't fit into one night... we make another\nSky Light Fest : The Original - DAY 02 22nd February | Rock House, Piliyandala.\n\nTickets available now !!!\nVisit www.tickets.lk to get your tickets.");

  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const totalImages = images.length + filesArray.length;
      
      if (totalImages > 6) {
        alert("You can only upload up to 6 images.");
        const remainingSlots = 6 - images.length;
        if (remainingSlots > 0) {
          setImages((prev) => [...prev, ...filesArray.slice(0, remainingSlots)]);
        }
        return;
      }
      setImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const renderPreview = () => {
    const props = {
      caption: postCaption,
      imageUrl: images.length > 0 ? URL.createObjectURL(images[0]) : undefined,
    };

    switch (selectedPlatform) {
      case 'instagram':
        return <InstagramPreview {...props} />;
      case 'facebook':
        return <FacebookPreview {...props} />;
      case 'twitter':
        return <TwitterPreview {...props} />;
      case 'tiktok':
        return <TikTokPreview {...props} />;
      case 'youtube':
        return <YouTubePreview {...props} title={postCaption.split('\n')[0]} />;
      case 'whatsapp':
        return <WhatsAppPreview {...props} />;
      case 'telegram':
        return <TelegramPreview {...props} />;
      default:
        return <InstagramPreview {...props} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#030712] text-white p-8 font-sans">

      {/*navbar goes here*/}
      <nav className="w-full max-w-6xl flex flex-wrap items-center justify-between py-6 px-8 mb-12">
        <div className="flex items-center gap-2">
          {/* Logo placeholder */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500"></div>
          <span className="font-bold text-lg tracking-wide hidden sm:block">Orean</span>
        </div>

        <ul className="flex flex-wrap gap-8 text-sm font-medium text-gray-300">
          <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Workflow</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
          <li><a href="#" className="hover:text-white transition-colors">GEO Studio</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Calendar</a></li>
        </ul>

        <div className="flex items-center gap-4">
          {/* Profile/Notification Placeholders */}
          <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div className="w-10 h-10 bg-yellow-100 rounded-full border-2 border-gray-800"></div>
        </div>
      </nav>

      <main className="flex w-full max-w-6xl gap-8 relative">

        {/* Main Content Area - Create Post */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Create Post Header & Inputs */}
          <div className="bg-[#0B1221] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden ">
            <h2 className="text-xl font-semibold text-white ">Create Post</h2>
            <br></br>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 ml-4">
                  <span>Sharing to:</span>
                  {/* insert social media icons later */}
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer relative group">
                      <input type="checkbox" name="facebook" className="peer sr-only " />
                      <div className="w-8 h-8 rounded-full bg-black border border-gray-600 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100">F</div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input type="checkbox" name="instagram" className="peer sr-only" defaultChecked />
                      <div className="w-8 h-8 rounded-full bg-black border border-gray-600 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100">I</div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input type="checkbox" name="tiktok" className="peer sr-only" />
                      <div className="w-8 h-8 rounded-full bg-black border border-gray-600 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100">T</div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input type="checkbox" name="twitter" className="peer sr-only" defaultChecked />
                      <div className="w-8 h-8 rounded-full bg-black border border-gray-600 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100">T</div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input type="checkbox" name="whatsapp" className="peer sr-only" defaultChecked />
                      <div className="w-8 h-8 rounded-full bg-black border border-gray-600 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100">W</div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input type="checkbox" name="youtube" className="peer sr-only" defaultChecked />
                      <div className="w-8 h-8 rounded-full bg-black border border-gray-600 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100">Y</div>
                    </label>
                    <label className="cursor-pointer relative group">
                      <input type="checkbox" name="telegram" className="peer sr-only" defaultChecked />
                      <div className="w-8 h-8 rounded-full bg-black border border-gray-600 flex items-center justify-center peer-checked:ring-2 ring-white transition-all opacity-50 peer-checked:opacity-100">T</div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="relative">
                <select name="project-type" id="project-type" className="appearance-none bg-[#1F2937] text-gray-300 text-sm px-4 py-2 pr-8 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-500 border border-gray-700">
                  <option value="1">Project Type</option>
                  <option value="2">Project Type</option>
                  <option value="3">Project Type</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* description area */}
            <textarea
              className="w-full h-32 bg-transparent border border-gray-800 rounded-lg p-4 text-gray-300 text-sm mb-4 resize-none focus:outline-none focus:ring-1 focus:ring-gray-600"
              placeholder="What's on your mind?"
              value={postCaption}
              onChange={(e) => setPostCaption(e.target.value)}
            />
          </div>

          {/* content uploader */}
          <div className="bg-[#0B1221] border border-gray-800 rounded-2xl p-6 min-h-[12rem] flex flex-wrap items-center gap-4">
            
            {/* Uploaded Images */}
            {images.map((img, index) => (
              <div key={index} className="h-32 w-32 bg-[#1a1a1a] rounded-lg overflow-hidden relative group shrink-0">
                <img src={URL.createObjectURL(img)} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {images.length < 6 && (
              <label className="h-32 w-32 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400 transition-all cursor-pointer shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </label>
            )}

            {images.length === 0 && (
              <div className="flex-1 text-sm text-gray-500 ml-4">
                Click the + icon to upload up to 6 images.
              </div>
            )}
          </div>

          <div className="relative">
            <select name="project-type" id="project-type" className="appearance-none bg-[#1F2937] text-gray-300 text-sm px-4 py-2 pr-8 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-500 border border-gray-700">
              <option value="1">Settings</option>
              <option value="2">Settings</option>
              <option value="3">Settings</option>
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>

          {/* Posting Schedule */}
          <div className="bg-[#0B1221] border border-gray-800 rounded-2xl p-6 mt-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Posting Schedule</h3>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>When to post</span>
                <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-300">AI powered schedule</span>
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="schedule" className="w-5 h-5 accent-cyan-500 bg-transparent" defaultChecked />
                  <span className="text-gray-300">Post Now</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="schedule" className="w-5 h-5 accent-cyan-500 bg-transparent" />
                  <span className="text-gray-300">Schedule</span>
                  <span className="ml-auto text-gray-500 text-sm">--/--/--</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="schedule" className="w-5 h-5 accent-cyan-500 bg-transparent" />
                  <span className="text-gray-300">Add to Queue</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="schedule" className="w-5 h-5 accent-cyan-500 bg-transparent" />
                  <span className="text-gray-300">Add to Content Category</span>
                </label>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                <span className="text-gray-400 text-sm">Repeat Post</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="hidden lg:block w-80 bg-[#0B1221] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Preview</h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
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
