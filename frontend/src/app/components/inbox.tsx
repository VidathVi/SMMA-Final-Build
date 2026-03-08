"use client";

import React, { useState } from "react";
import "./inbox.css";

const initialChats = [
  {
    id: 1,
    name: "Thilina",
    type: "private",
    messages: [
      { from: "them", text: "Hello there!" },
      { from: "them", text: "Are you available today?" },
    ],
  },
  {
    id: 2,
    name: "Nadeesha",
    type: "comment",
    messages: [
      { from: "them", text: "Can we discuss?" },
      { from: "them", text: "About the project update." },
    ],
  },
  {
    id: 3,
    name: "Kasun",
    type: "review",
    messages: [
      { from: "them", text: "Review updated." },
      { from: "them", text: "Please check GitHub." },
    ],
  },
];

export default function Inbox() {
const [chats, setChats] = useState(initialChats);
const [inputValue, setInputValue] = useState("");
const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
const [activeTab, setActiveTab] = useState("all");

const selectedChat =
  chats.find((chat) => chat.id === selectedChatId) || null;

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
        : chat
    )
  );

  setInputValue("");
};

  return (
    <div className="inbox-container">
      {/* Sidebar */}
      <div className="sidebar">
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
                <h4>{chat.name}</h4>
                <p>{chat.messages[chat.messages.length - 1].text}</p>
              </div>

                ))}
              </div>
            </div>

      {/* Chat Area */}
      <div className="chat-area">
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
              )
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
          <button onClick={sendMessage} disabled={!selectedChatId}>Send</button>
        </div>
      </div>
    </div>
  );
}