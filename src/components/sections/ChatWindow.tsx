"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "@/lib/constants";
import { sendMessage } from "@/actions/chats";

type Msg = {
  _id?: string;
  chat: string;
  sender: string;
  text: string;
  createdAt: string;
  optimisticId?: string;
};

interface Props {
  chatId: string;
  currentUserId: string;
  initialMessages: Msg[];
}

export default function ChatWindow({ chatId, currentUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages || []);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const socket: Socket = useMemo(() => {
    return io(BACKEND_URL, {
      transports: ["websocket"],
      upgrade: false,
      withCredentials: true,
    });
  }, []);

  useEffect(() => {
    socket.emit("joinChat", chatId);
    const onReceive = (msg: Msg) => {
      if (msg.chat === chatId) {
        setMessages((prev) => {
          const newMsgs = prev.filter((msg) => !msg.optimisticId);
          return [...newMsgs, msg];
        });
      }
    };
    socket.on("receiveMessage", onReceive);
    return () => {
      socket.off("receiveMessage", onReceive);
      socket.disconnect();
    };
  }, [socket, chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    // optimistic
    const optimistic: Msg = {
      optimisticId: crypto.randomUUID(),
      chat: chatId,
      sender: currentUserId,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    try {
      await sendMessage(chatId, currentUserId, text);
      // server will broadcast real message via socket,
      // you could dedupe optimistic by optimisticId if you also echo it back.
    } catch (e) {
      // revert optimistic if needed
      setMessages((prev) => prev.filter((m) => m.optimisticId !== optimistic.optimisticId));
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-6rem)] w-full max-w-md flex-col rounded-2xl border">
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m, i) => {
          const mine = m.sender === currentUserId;
          return (
            <div
              key={m._id || m.optimisticId || i}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              >
                <div>{m.text}</div>
                <div className="mt-1 text-[10px] opacity-70">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t p-2">
        <input
          className="flex-1 rounded-lg border px-3 py-2 focus:ring-1 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message…"
        />
        <button
          onClick={handleSend}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
