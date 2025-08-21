// lib/postService.ts
"use server";

import { connectToDatabase } from "@/db/connect";
import Post from "@/db/schemas/post.schema";
import User from "@/db/schemas/user.schema";

export async function getPostById(postId: string) {
  await connectToDatabase();

  const post = await Post.findById(postId)
    .populate("owner", "username avatar name") // only pick useful fields
    .lean();

  if (!post) {
    throw new Error("Post not found");
  }

  return JSON.parse(JSON.stringify(post)); // make it serializable
}
