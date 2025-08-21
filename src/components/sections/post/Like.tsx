"use client";

import { useState } from "react";
import { Heart } from "lucide-react"; // like icon
import { toggleLike } from "@/actions/likehandler";

interface LikeProps {
  postId: string;
  initialLikes: string[]; // user IDs who liked
  currentUserId: string;
}

export default function Like({ postId, initialLikes, currentUserId }: LikeProps) {
  const [liked, setLiked] = useState(initialLikes.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(initialLikes.length);

  const handleClick = async () => {
    try {
      const result = await toggleLike(postId);
      setLiked(result.liked);
      setLikeCount((prev) => prev + (result.liked ? 1 : -1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 ${liked ? "text-red-500" : "text-muted-foreground"}`}
    >
      <Heart className="h-5 w-5" />
      {likeCount}
    </button>
  );
}
