"use server";

import { connectToDatabase } from "@/db/connect";
import Chat from "@/db/schemas/cahat.schema";
import { getSession } from "@/lib/getSession";
import { supabase } from "@/lib/supabase";

export async function postMessage(chatId: string, text: string) {
  await connectToDatabase();

  const session = await getSession();
  if (!session?.id) throw new Error("Not authenticated");

  const newMsg = await Chat.create({
    chatId,
    text,
    sender: session.id,
  });

  // Mirror the message to Supabase for realtime updates
  await supabase.from("chats").insert([
    {
      _id: newMsg._id.toString(),
      chatId,
      text,
      sender: session.id,
      createdAt: newMsg.createdAt.toISOString(),
    },
  ]);

  return newMsg;
}
