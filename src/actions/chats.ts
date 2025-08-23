"use server";

import axios from "axios";
import { BACKEND_URL } from "@/lib/constants";

// Get or create chat between current user and peer
export async function openChat(userA: string, userB: string) {
  const { data } = await axios.post(`${BACKEND_URL}/api/chats/open`, { userA, userB });
  return data as { _id: string; participants: string[] };
}

// Get messages of a chat
export async function getMessages(chatId: string) {
  const { data } = await axios.get(`${BACKEND_URL}/api/chats/${chatId}/messages`);
  return data as Array<{
    _id: string;
    chat: string;
    sender: string;
    text: string;
    createdAt: string;
  }>;
}

// Send a message
export async function sendMessage(chatId: string, senderId: string, text: string) {
  const { data } = await axios.post(`${BACKEND_URL}/api/chats/${chatId}/messages`, {
    senderId,
    text,
  });
  return data as { _id: string; chat: string; sender: string; text: string; createdAt: string };
}
