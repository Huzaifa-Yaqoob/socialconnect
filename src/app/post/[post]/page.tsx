import { connectToDatabase } from "@/db/connect";
import Post from "@/db/schemas/post.schema";
import { getPostById } from "@/actions/getDetailedPost";
import { PostCard } from "@/components/sections/post/PostCard";
import Like from "@/components/sections/post/Like";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import { CommentList } from "@/components/sections/post/ShowComment";

interface PageProps {
  params: Promise<{ post: string }>;
}

async function Page({ params }: PageProps) {
  const { post } = await params;
  const session = await getSession();

  if (!session) {
    redirect("/auth/?form=login");
  }

  await connectToDatabase();

  const postDetail = await getPostById(post);

  return (
    <div>
      <PostCard post={postDetail} currentUserId={session.id} />
    </div>
  );
}

export default Page;
