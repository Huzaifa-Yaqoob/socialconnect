// src/actions/createPost.ts
"use server";

import Post from "@/db/schemas/post.schema";
import { connectToDatabase } from "@/db/connect"; // your mongoose connection helper
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";

interface CreatePostInput {
  text: string;
  imageUrl?: string;
}

export async function createPost({ text, imageUrl }: CreatePostInput) {
  await connectToDatabase();
  const session = await getSession();

  if (!session) {
    redirect("/auth/?form=login");
  }

  try {
    const post = await Post.create({
      text,
      image: imageUrl,
      owner: session.id,
    });

    // Revalidate feed page
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    console.error("Error creating post:", err);
    return { success: false, error: err.message };
  }
}

export async function deletePost(postId: string) {
  await connectToDatabase();
  const session = await getSession();

  if (!session) {
    redirect("/auth/?form=login");
  }

  try {
    // Ensure the post belongs to the logged-in user
    const post = await Post.findOne({ _id: postId, owner: session.id });
    if (!post) {
      return { success: false, error: "Post not found or unauthorized" };
    }

    await Post.deleteOne({ _id: postId, owner: session.id });

    // Revalidate feed page
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    console.error("Error deleting post:", err);
    return { success: false, error: err.message };
  }
}
