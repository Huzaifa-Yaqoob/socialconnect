"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Like from "@/components/sections/post/Like";
import { CommentList } from "@/components/sections/post/ShowComment";
import { CommentForm } from "@/components/sections/post/PostComment";
import { getComments } from "@/actions/comment";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
  transports: ["websocket"],
});

interface PostCardProps {
  post: Awaited<ReturnType<typeof import("@/actions/getDetailedPost").getPostById>>;
  currentUserId: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [comments, setComments] = useState<any>([]);

  useEffect(() => {
    // Fetch existing comments
    getComments(post._id).then((c) => {
      setComments(c);
    });

    // Join socket room
    socket.emit("joinPost", post._id);

    // Listen for new comments
    socket.on("newComment", (comment) => {
      if (comment.postId === post._id) {
        setComments((prev: any) => {
          const newC = prev.filter((c: any) => prev._id !== c._id);
          return [...prev, comment];
        });
      }
    });

    return () => {
      socket.off("newComment");
    };
  }, [post._id]);

  return (
    <div className="flex justify-center px-4 py-6">
      <Card className="w-full max-w-3xl border-0 shadow-none">
        <CardContent className="flex flex-col gap-4 p-0">
          {/* Top Row: Avatar + Content */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Avatar className="h-14 w-14">
                <AvatarImage src={post.owner?.avatar} />
                <AvatarFallback>{post.owner?.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-3">
              {/* User Info */}
              <div>
                <h2 className="text-lg font-semibold">
                  {post.owner?.name || post.owner?.username}
                </h2>
                <p className="text-muted-foreground text-sm">@{post.owner?.username}</p>
              </div>

              {/* Post Text */}
              <p className="text-base leading-relaxed">{post.text}</p>

              {/* Post Image */}
              {post.image && (
                <div className="overflow-hidden rounded-xl border">
                  <img
                    src={post.image}
                    alt="Post image"
                    className="max-h-[400px] w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer: Date + Like */}
          <div className="text-muted-foreground flex items-center justify-between border-t pt-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>

            {/* Like Button */}
            <Like postId={post._id} currentUserId={currentUserId} initialLikes={post.likes || []} />
          </div>

          {/* Comments Section */}
          <div className="mt-4 space-y-4">
            <CommentList comments={comments} />
            <CommentForm
              postId={post._id}
              onCommentSubmit={(c: any) => {
                console.log(c);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
