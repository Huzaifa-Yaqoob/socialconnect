// actions/postActions.ts
"use server";

import { connectToDatabase } from "@/db/connect";
import Post from "@/db/schemas/post.schema";
import { getSession } from "@/lib/getSession";
import mongoose from "mongoose";

export async function toggleLike(postId: string) {
  await connectToDatabase();

  const session = await getSession();
  if (!session?.id) throw new Error("Not authenticated");

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  const userId = new mongoose.Types.ObjectId(session.id);

  if (post.likes.includes(userId)) {
    // Unlike
    post.likes = post.likes.filter((id) => id !== userId);
    await post.save();
    return { liked: false };
  } else {
    // Like
    post.likes.push(userId);
    await post.save();
    return { liked: true };
  }
}
