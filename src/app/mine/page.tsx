// app/mutual-followers/page.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getMutualFollowers } from "@/actions/getMutualConnection";

interface User {
  _id: string;
  username: string;
  name?: string;
  avatar?: string;
}

export default async function MutualFollowersPage() {
  const users: User[] = await getMutualFollowers();

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-sm space-y-4">
        {users.length === 0 && (
          <p className="text-muted-foreground text-center">No mutual followers found.</p>
        )}

        {users.map((user) => (
          <Card key={user._id} className="rounded-2xl border shadow-none">
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold">{user.name || user.username}</span>
                  <span className="text-muted-foreground text-sm">@{user.username}</span>
                </div>
              </div>

              <Link href={`/chat/${user._id}`}>
                <button className="bg-primary rounded-lg px-3 py-1 text-sm text-white">Chat</button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
