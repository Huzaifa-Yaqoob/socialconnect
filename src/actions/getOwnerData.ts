"use server";

import User from "@/db/schemas/user.schema";
import { connectToDatabase } from "@/db/connect";

export async function getOwnerDetail(userId: string) {
  await connectToDatabase();

  const owner = await User.findById(userId).lean();

  if (!owner) {
    return {};
  }

  return JSON.parse(JSON.stringify(owner)); // make it serializable
}
