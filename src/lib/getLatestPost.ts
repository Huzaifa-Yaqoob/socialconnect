// lib/getLatestPosts.ts
import Post from "@/db/schemas/post.schema";
import User from "@/db/schemas/user.schema";

export async function getLatestPosts(page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate({
        path: "owner",
        select: "username avatar _id",
      })
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit)
      .lean();

    return posts.map((post: any) => ({
      id: post._id.toString(),
      description: post.text,
      image: post.image || null,
      createdAt: post.createdAt,
      user: {
        username: post.owner?.username,
        avatar: post.owner?.avatar || null,
        id: post.owner._id.toString(),
      },
    }));
  } catch (err) {
    console.error("Error fetching posts:", err);
    return [];
  }
}
