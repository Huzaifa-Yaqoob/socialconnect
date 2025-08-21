// app/chat/[userId]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { getSession } from "@/lib/getSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  senderId: string;
  message: string;
  createdAt: string;
}

interface ChatPageProps {
  userId: string;
  sessionId: string;
}

let socket: Socket;

export default function ChatPage({ userId, sessionId }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUserId(sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (!socket) socket = io(); // connect to the same origin

    const roomId = [currentUserId, userId].sort().join("_"); // unique room ID
    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, userId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const roomId = [currentUserId, userId].sort().join("_");
    socket.emit("sendMessage", { roomId, message: input, senderId: currentUserId });
    setMessages((prev) => [
      ...prev,
      { senderId: currentUserId, message: input, createdAt: new Date().toISOString() },
    ]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] max-w-[500px] flex-grow flex-col justify-between p-4">
      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-3 py-2 text-white ${msg.senderId === currentUserId ? "bg-blue-500" : "bg-gray-500"}`}
            >
              {msg.message}
              <div className="text-xs text-gray-200">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="focus:ring-primary flex-1 rounded-lg border px-3 py-2 focus:ring-1 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-primary rounded-lg px-4 py-2 text-white">
          Send
        </button>
      </div>
    </div>
  );
}
