// frontend/actions/commentApi.ts
"use server";

import { getSession } from "@/lib/getSession";
import axios from "axios";
import { redirect } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function getComments(postId: string) {
  const res = await axios.get(`${API_BASE}/api1/posts/${postId}/comments`);
  return res.data;
}

export async function addComment(postId: string, comment: any) {
  const session = await getSession();

  if (!session?.id) {
    redirect("/auth");
  }

  const res = await axios.post(`${API_BASE}/api1/posts/${postId}/comments`, {
    ...comment,
    owner: session.id,
  });
  return res.data;
}
