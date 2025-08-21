// actions/getMutualFollowers.ts
"use server";

import { getSession } from "@/lib/getSession";
import User from "@/db/schemas/user.schema";
import { Types } from "mongoose";

export async function getMutualFollowers() {
  const session = await getSession();
  if (!session?.id) return [];

  const currentUser = await User.findById(session.id).select("following");
  if (!currentUser) return [];

  // Find users who are followed by current user AND follow the current user
  const mutualUsers = await User.find({
    _id: { $in: currentUser.following },
    following: session.id, // they follow me back
  }).select("username name avatar");

  return mutualUsers;
}
