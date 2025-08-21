"use client";

import { useState } from "react";
import { searchEverything } from "@/actions/getPostUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface User {
  _id: string;
  username: string;
  name?: string;
  avatar?: string;
}

interface Post {
  _id: string;
  text: string;
  image?: string;
  owner: {
    _id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const result = await searchEverything(query);
      setUsers(result.users);
      setPosts(result.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6 flex w-full max-w-md gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users or posts..."
          className="focus:ring-primary flex-1 rounded-lg border px-3 py-2 focus:ring-1 focus:outline-none"
        />
        <button onClick={handleSearch} className="bg-primary rounded-lg px-4 py-2 text-white">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && (users.length > 0 || posts.length > 0) && (
        <Tabs defaultValue="users" className="w-full max-w-md">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            {users.map((user) => (
              <Card className="rounded-2xl border shadow-none">
                <CardContent className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">{user.name || user.username}</span>
                    <span className="text-muted-foreground text-sm">@{user.username}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {posts.map((post) => (
              <Link href={`/post/${post._id}`} className={"block"} key={post._id}>
                <Card className="rounded-2xl border shadow-none">
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.owner.avatar} />
                        <AvatarFallback>{post.owner.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold">{post.owner.username}</span>
                      </div>
                    </div>
                    <p className="text-sm">{post.text}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="post"
                        className="max-h-64 w-full rounded-lg object-cover"
                      />
                    )}
                    <span className="text-muted-foreground text-xs">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
