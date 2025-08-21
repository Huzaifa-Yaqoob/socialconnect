"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/actions/toggleFollow";
import { checkFollowing } from "@/actions/checkFollow";

interface FollowButtonProps {
  targetUserId: string;
  currentUserId: string;
}

export default function FollowButton({ targetUserId, currentUserId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  // Fetch initial follow state
  useEffect(() => {
    const fetchFollowState = async () => {
      try {
        const result = await checkFollowing(currentUserId, targetUserId);
        setIsFollowing(result.isFollowing);
      } catch (err) {
        console.error("Failed to get follow state:", err);
      }
    };
    fetchFollowState();
  }, [currentUserId, targetUserId]);

  const handleFollow = async () => {
    startTransition(async () => {
      try {
        const result = await toggleFollow(targetUserId);
        if (result?.success) {
          setIsFollowing(result.following);
        }
      } catch (err) {
        console.error("Failed to follow/unfollow user:", err);
      }
    });
  };

  if (isFollowing === null)
    return (
      <Button size="sm" variant="default" disabled>
        ...
      </Button>
    );

  return (
    <Button
      size="sm"
      variant={isFollowing ? "secondary" : "default"}
      onClick={handleFollow}
      disabled={isPending}
    >
      {isPending ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
