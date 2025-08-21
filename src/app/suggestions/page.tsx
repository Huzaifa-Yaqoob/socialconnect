import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getUsersWithSharedInterests } from "@/actions/getSuggestions";
import FollowButton from "@/components/sections/FollowUnfollow";
import { getSession } from "@/lib/getSession";

interface User {
  _id: string;
  username: string;
  name?: string;
  avatar?: string;
  interests: { value: string; label: string }[];
}

export default async function SharedInterestsPage() {
  const session = await getSession();
  const currentUserId = session?.id || "";

  const users: User[] = await getUsersWithSharedInterests();

  console.log(users, "aaasasasasas");

  // For each user, determine if the logged-in user is already following them
  // (assuming getUsersWithSharedInterests returns the 'following' array too)
  const usersWithFollowStatus = users.map((user: any) => ({
    ...user,
    initiallyFollowing: user.followedByCurrentUser || false,
  }));

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-sm space-y-4">
        {users.map((user) => (
          <Card key={user._id} className="rounded-2xl border shadow-none">
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold">{user.name || user.username}</span>
                  <span className="text-muted-foreground text-sm">@{user.username}</span>
                  <div className="text-muted-foreground mt-1 flex flex-wrap gap-1 text-xs">
                    {user.interests.map((i: any) => (
                      <span
                        key={i.value}
                        className="rounded-full bg-gray-200 px-2 py-0.5 dark:bg-gray-700"
                      >
                        {i.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Client FollowButton */}
              <FollowButton targetUserId={user._id.toString()} currentUserId={currentUserId} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
