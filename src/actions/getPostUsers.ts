"use server";

import { connectToDatabase } from "@/db/connect";
import User from "@/db/schemas/user.schema";
import Post from "@/db/schemas/post.schema";

interface SearchResult {
  users: {
    _id: string;
    username: string;
    name?: string;
    avatar?: string;
  }[];
  posts: {
    _id: string;
    text: string;
    image?: string;
    owner: {
      _id: string;
      username: string;
      avatar?: string;
    };
    createdAt: string;
  }[];
}

export async function searchEverything(query: string): Promise<SearchResult> {
  if (!query || !query.trim()) {
    return { users: [], posts: [] };
  }

  await connectToDatabase();

  const searchRegex = new RegExp(query.trim(), "i"); // case-insensitive

  // Search users by username or name
  const users = await User.find({
    $or: [{ username: searchRegex }, { name: searchRegex }],
  }).select("username name avatar");

  // Search posts by text and populate owner
  const posts = await Post.find({ text: searchRegex })
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

  return {
    users: users.map((u) => ({
      _id: u._id.toString(),
      username: u.username,
      name: u.name,
      avatar: u.avatar,
    })),
    posts: posts.map((p: any) => ({
      _id: p._id.toString(),
      text: p.text,
      image: p.image,
      owner: {
        _id: (p.owner as any)._id.toString(),
        username: (p.owner as any).username,
        avatar: (p.owner as any).avatar,
      },
      createdAt: p.createdAt.toISOString(),
    })),
  };
}
