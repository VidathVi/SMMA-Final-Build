"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import PersonalProfile from "../components/PersonalProfile";
import "../profile.css";
import { motion } from "framer-motion";

export default function PersonalProfilePage() {
  const [user, setUser] = useState({
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    jobTitle: "Content Strategist",
    department: "Marketing",
    workflowRole: "Reviewer",
    timeZone: "(GMT+5:30) Sri Lanka",
    language: "English",
    avatar: "/default-avatar.png",
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user_profile");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user profile", e);
      }
    }
  }, []);

  const handleUserUpdate = (field: string, value: string) => {
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);
    localStorage.setItem("user_profile", JSON.stringify(updatedUser));

    // Trigger storage event for other components (like Navbar) to update
    window.dispatchEvent(new Event("storage_user_profile"));
  };

  return (
    <div className="min-h-screen bg-[#0A0A3C]">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="app-container"
        style={{
          minHeight: "calc(100vh - 80px)",
          backgroundColor: "transparent",
        }}
      >
        <div className="app-body">
          <main
            className="main-content"
            style={{ backgroundColor: "transparent" }}
          >
            <PersonalProfile user={user} onUpdate={handleUserUpdate} />
          </main>
        </div>
      </motion.div>
    </div>
  );
}
