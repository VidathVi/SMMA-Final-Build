"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Send,
  MessageSquare,
  MessageCircle,
  Star,
} from "lucide-react";

const initialChats = [
  {
    id: 1,
    name: "Thilina",
    type: "private",
    avatar: "TH",
    messages: [
      { from: "them", text: "Hello there!" },
      { from: "them", text: "Are you available today?" },
    ],
  },
  {
    id: 2,
    name: "Nadeesha",
    type: "comment",
    avatar: "NA",
    messages: [
      { from: "them", text: "The design looks amazing! How can I order this?" },
      {
        from: "me",
        text: "Thank you! You can place your order through our website or send us a DM.",
      },
    ],
  },
  {
    id: 3,
    name: "Kasun",
    type: "review",
    avatar: "KA",
    messages: [
      {
        from: "them",
        text: "⭐️⭐️⭐️⭐️⭐️ The product quality is excellent. Highly recommended!",
      },
      {
        from: "me",
        text: "Thank you so much for your feedback! We appreciate your support.",
      },
    ],
  },
];

export default function InboxPage() {
  const [chats, setChats] = useState(initialChats);
  const [inputValue, setInputValue] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  const filteredChats = (
    activeTab === "all"
      ? chats
      : chats.filter((chat) => chat.type === activeTab)
  ).filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sendMessage = () => {
    if (!selectedChatId) return;
    if (inputValue.trim() === "") return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { from: "me", text: inputValue.trim() },
              ],
            }
          : chat,
      ),
    );
    setInputValue("");
  };

  const tabs = [
    { id: "all", label: "All", icon: MessageSquare },
    { id: "private", label: "Private", icon: MessageCircle },
    { id: "comment", label: "Comments", icon: MessageSquare },
    { id: "review", label: "Reviews", icon: Star },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 h-[calc(100vh-5rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
          Unified Inbox
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage all your conversations in one place.
        </p>
      </div>

      <div className="flex gap-6 h-[calc(100%-5rem)]">
        {/* Chat List Sidebar */}
        <div className="w-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden shrink-0">
          {/* Search */}
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-3 border-b border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-4 cursor-pointer border-b border-white/5 flex items-start gap-3 transition-colors ${
                  selectedChatId === chat.id
                    ? "bg-white/10 border-l-2 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg">
                  {chat.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white truncate">
                      {chat.name}
                    </h4>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        chat.type === "private"
                          ? "bg-blue-500/20 text-blue-300"
                          : chat.type === "comment"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {chat.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {chat.messages[chat.messages.length - 1].text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              {selectedChat && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  {selectedChat.avatar}
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-white">
                  {selectedChat ? selectedChat.name : "Select a chat"}
                </h3>
                {selectedChat && (
                  <p className="text-[11px] text-slate-400">
                    {selectedChat.type === "private"
                      ? "Private Chat"
                      : selectedChat.type === "comment"
                        ? "Post Comment"
                        : "Review"}
                  </p>
                )}
              </div>
            </div>
            {selectedChat && (
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs font-bold hover:bg-white/10 transition-all">
                  Mark as Read
                </button>
                <button className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs font-bold hover:bg-white/10 transition-all">
                  Assign To
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedChat ? (
              selectedChat.messages.map(
                (msg: { from: string; text: string }, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                        msg.from === "me"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                          : "bg-white/10 text-slate-200 rounded-bl-md border border-white/10"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ),
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  No chat selected
                </h3>
                <p className="text-sm text-slate-400">
                  Select a conversation from the left to start messaging.
                </p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/10 bg-black/10">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={
                  selectedChat
                    ? "Type your message here..."
                    : "Select a chat first"
                }
                disabled={!selectedChatId}
                className="flex-1 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!selectedChatId || !inputValue.trim()}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
