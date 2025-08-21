"use server";

import { connectToDatabase } from "@/db/connect";
import User from "@/db/schemas/user.schema";
import { getSession } from "@/lib/getSession";

export async function getUsersWithSharedInterests() {
  await connectToDatabase();

  const session = await getSession();
  if (!session?.id) throw new Error("Not authenticated");

  // Get the logged-in user's interests
  const currentUser = await User.findById(session.id).select("interests");
  if (!currentUser) throw new Error("User not found");

  // Fetch all users who share at least one interest, excluding the current user
  const users = await User.find({
    _id: { $ne: session.id },
    "interests.value": {
      $in: currentUser.interests.map((i: { value: string; label: string; _id: any }) => i.value),
    },
  }).select("username name avatar interests");

  return users;
}
