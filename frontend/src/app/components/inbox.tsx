"use client";

import React, { useState } from "react";
import "./inbox.css";

const initialChats = [
  {
    id: 1,
    name: "Thilina",
    messages: [
      { from: "them", text: "Hello there!" },
      { from: "them", text: "Are you available today?" },
    ],
  },
  {
    id: 2,
    name: "Nadeesha",
    messages: [
      { from: "them", text: "Can we discuss?" },
      { from: "them", text: "About the project update." },
    ],
  },
  {
    id: 3,
    name: "Kasun",
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

  const selectedChat =
    chats.find((chat) => chat.id === selectedChatId) || null;

  const sendMessage = () => {
    if (!selectedChatId) return;
    if (inputValue.trim() === "") return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, { from: "me", text: inputValue.trim() }],
            }
          : chat
      )
    );

    setInputValue("");
  };

  return (
    <div className="inbox-container">
      <div className="sidebar">
        <div className="logo">Logo</div>

        <input type="text" placeholder="Search..." className="search" />

        <div className="tabs">
          <button>All</button>
          <button>Private Chats</button>
          <button>Post Comments</button>
          <button>Reviews</button>
        </div>

        <div className="chat-list">
          {chats.map((chat) => (
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
            <div className="empty-state">Select a chat to view messages.</div>
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
      </div>
    </div>
  );
}