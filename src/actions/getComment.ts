// actions/commentActions.ts
"use server";

import { connectToDatabase } from "@/db/connect";
import Comment from "@/db/schemas/comment.schema";
import User from "@/db/schemas/user.schema";

export async function getComments(postId: string) {
  await connectToDatabase();

  const comments = await Comment.find({ post: postId })
    .populate("owner", "username avatar name")
    .sort({ createdAt: 1 })
    .lean();

  return JSON.parse(JSON.stringify(comments));
}
