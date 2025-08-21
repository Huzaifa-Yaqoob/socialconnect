"use server";

import { connectToDatabase } from "@/db/connect";
import User from "@/db/schemas/user.schema";
import { getSession } from "@/lib/getSession";
import { Types } from "mongoose";

export async function toggleFollow(targetUserId: string) {
  await connectToDatabase();

  const session = await getSession();
  if (!session?.id) throw new Error("Not authenticated");

  const currentUser = await User.findById(session.id);
  if (!currentUser) throw new Error("User not found");

  const targetObjectId = new Types.ObjectId(targetUserId);

  const isFollowing = currentUser.following.some((id: any) => id.equals(targetObjectId));

  if (isFollowing) {
    // Unfollow
    currentUser.following = currentUser.following.filter((id: any) => !id.equals(targetObjectId));
  } else {
    // Follow
    currentUser.following.push(targetObjectId);
  }

  await currentUser.save();

  return { success: true, following: !isFollowing };
}
