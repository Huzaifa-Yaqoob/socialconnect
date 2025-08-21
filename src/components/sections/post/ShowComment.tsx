"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Comment {
  _id: string;
  owner: { avatar: string; name: string; username: string };
  text: string;
}

interface CommentProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.owner?.avatar} />
            <AvatarFallback>{comment.owner?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">
              {comment.owner?.name || comment.owner?.username}
            </p>
            <p className="text-muted-foreground text-sm">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
