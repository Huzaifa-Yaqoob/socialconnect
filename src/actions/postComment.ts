"use server";

import { connectToDatabase } from "@/db/connect";
import Comment from "@/db/schemas/comment.schema";
import { getSession } from "@/lib/getSession";

export async function postComment(postId: string, text: string) {
  await connectToDatabase();

  const session = await getSession();
  if (!session?.id) throw new Error("Not authenticated");

  const newComment = await Comment.create({
    text,
    post: postId,
    owner: session.id,
  });

  return JSON.parse(JSON.stringify(newComment));
}
