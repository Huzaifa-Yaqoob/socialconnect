import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import PostsList from "@/components/sections/PostList";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { username } = await params;
  const p = await searchParams;
  const page = Number(p.page) || 1;
  const session = await getSession();

  console.log(session);

  if (!session) {
    redirect(`/auth?form=login`);
  }

  return (
    <main className="mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">Latest Posts</h1>
      {/* Server Component */}
      <PostsList page={page} userId={session.id} />

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-between">
        {page > 1 ? (
          <a href={`/posts?page=${page - 1}`} className="rounded bg-gray-200 px-4 py-2">
            Previous
          </a>
        ) : (
          <span />
        )}
        <a href={`/posts?page=${page + 1}`} className="rounded bg-gray-200 px-4 py-2">
          Next
        </a>
      </div>
    </main>
  );
}
