"use server";

import { connectToDatabase } from "@/db/connect";
import Chat from "@/db/schemas/cahat.schema";

export async function getChatMessages(chatId: string) {
  await connectToDatabase();

  const messages = await Chat.find({ chatId })
    .populate("sender", "username avatar")
    .sort({ createdAt: 1 })
    .lean();

  return messages;
}
