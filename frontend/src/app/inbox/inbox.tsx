"use client";

import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Linkedin,
  Youtube,
  Twitter,
} from "lucide-react";
import { motion } from "framer-motion";
import "./inbox.css";

const initialChats = [
  {
    id: 1,
    name: "Facebook",
    type: "private",
    icon: Facebook,
    color: "#1877F2",
    messages: [
      { from: "them", text: "Hello there!" },
      { from: "them", text: "Are you available today?" },
    ],
  },
  {
    id: 2,
    name: "Instagram",
    type: "comment",
    icon: Instagram,
    color: "#E1306C",
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
    name: "WhatsApp",
    type: "review",
    icon: MessageCircle,
    color: "#25D366",
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
  {
    id: 4,
    name: "LinkedIn",
    type: "private",
    icon: Linkedin,
    color: "#0A66C2",
    messages: [
      { from: "them", text: "I would like to discuss a business opportunity." },
      { from: "me", text: "Hi! I'd love to connect and chat about this." },
    ],
  },
  {
    id: 5,
    name: "YouTube",
    type: "comment",
    icon: Youtube,
    color: "#FF0000",
    messages: [{ from: "them", text: "Great video! Subscribed." }],
  },
  {
    id: 6,
    name: "X",
    type: "private",
    icon: Twitter,
    color: "#E2E8F0",
    messages: [{ from: "them", text: "Hey! Just saw your latest tweet." }],
  },
];

export default function Inbox() {
  const [chats, setChats] = useState(initialChats);
  const [inputValue, setInputValue] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  const filteredChats =
    activeTab === "all"
      ? chats
      : chats.filter((chat) => chat.type === activeTab);

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

  return (
    <div className="inbox-container">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="sidebar"
      >
        <div className="logo">Logo</div>

        <input type="text" placeholder="Search..." className="search" />

        <div className="tabs">
          <button
            className={activeTab === "all" ? "active-tab" : ""}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>

          <button
            className={activeTab === "private" ? "active-tab" : ""}
            onClick={() => setActiveTab("private")}
          >
            Private Chats
          </button>

          <button
            className={activeTab === "comment" ? "active-tab" : ""}
            onClick={() => setActiveTab("comment")}
          >
            Post Comments
          </button>

          <button
            className={activeTab === "review" ? "active-tab" : ""}
            onClick={() => setActiveTab("review")}
          >
            Reviews
          </button>
        </div>

        <div className="chat-list">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${selectedChatId === chat.id ? "active" : ""}`}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "4px",
                }}
              >
                <chat.icon size={20} color={chat.color} />
                <h4>{chat.name}</h4>
              </div>
              <p>{chat.messages[chat.messages.length - 1].text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="chat-area"
      >
        <div className="chat-header">
          <h3>{selectedChat ? selectedChat.name : "Select a chat"}</h3>
          <div className="actions">
            <button>Mark as Read</button>
            <button>Assign To</button>
          </div>
        </div>

        <div className="messages">
          {selectedChat ? (
            selectedChat.messages.map(
              (msg: { from: string; text: string }, index: number) => (
                <div
                  key={index}
                  className={`message-bubble ${msg.from === "me" ? "sent" : "received"}`}
                >
                  {msg.text}
                </div>
              ),
            )
          ) : (
            <p>Select a chat to view messages.</p>
          )}
        </div>

        <div className="message-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
          />
          <button onClick={sendMessage} disabled={!selectedChatId}>
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
}
