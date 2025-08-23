"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getOwnerDetail } from "@/actions/getOwnerData";
import { useEffect, useState } from "react";

interface Comment {
  _id: string;
  owner: string;
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
          <OwnerDetails owner={comment.owner} text={comment.text} />
        </div>
      ))}
    </div>
  );
}

function OwnerDetails({ owner, text }: { owner: string; text: string }) {
  const [ownerDta, setOwnerDta] = useState<any>({});
  useEffect(() => {
    (async () => {
      const data = await getOwnerDetail(owner);
      setOwnerDta(data);
    })();
  }, [owner]);
  return (
    <>
      <Avatar className="h-8 w-8">
        <AvatarImage src={ownerDta?.avatar} />
        <AvatarFallback>{ownerDta?.username?.[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold">{ownerDta?.name || ownerDta?.username}</p>
        <p className="text-muted-foreground text-sm">{text}</p>
      </div>
    </>
  );
}
