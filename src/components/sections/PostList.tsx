// app/components/PostsList.tsx
import { getLatestPosts } from "@/lib/getLatestPost";
import { Button } from "@/components/ui/button";
import Delete from "@/components/sections/Delete";

type PostsListProps = {
  page?: number;
  userId: string;
};

export default async function PostsList({ page = 1, userId }: PostsListProps) {
  const posts = await getLatestPosts(page, 10);

  if (posts.length === 0) {
    return <p className="text-gray-500">No posts yet.</p>;
  }

  console.log(posts);

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="rounded-lg border p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            {post.user.avatar ? (
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            )}
            <span className="font-semibold">{post.user.username}</span>
            {post.user.id === userId && <Delete id={post.id} />}
          </div>
          <p className="mb-2">{post.description}</p>
          {post.image && (
            <img src={post.image} alt="post image" className="max-h-80 rounded-lg object-cover" />
          )}
          <div className="mt-2 text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
