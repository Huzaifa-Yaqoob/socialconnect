"use client";

import { useState } from "react";
import { postComment } from "@/actions/postComment";

interface CommentFormProps {
  postId: string;
  onCommentSubmit: (comment: any) => void;
}

export function CommentForm({ postId, onCommentSubmit }: CommentFormProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const newComment = await postComment(postId, text.trim());
      setText("");
      onCommentSubmit?.(newComment);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background sticky bottom-0 flex items-center gap-2 p-4"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="focus:ring-primary flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="bg-primary rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        Comment
      </button>
    </form>
  );
}
