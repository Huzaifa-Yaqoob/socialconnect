"use server";
import User from "@/db/schemas/user.schema";
import { Types } from "mongoose";

export async function checkFollowing(currentUserId: string, targetUserId: string) {
  const currentUser = await User.findById(currentUserId).select("following");
  if (!currentUser) return { isFollowing: false };

  const isFollowing = currentUser.following.some((id: Types.ObjectId) =>
    id.equals(new Types.ObjectId(targetUserId))
  );
  return { isFollowing };
}
