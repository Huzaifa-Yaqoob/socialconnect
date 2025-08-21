import ChatPage from "@/components/sections/Chats";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { userId } = await params;
  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className={"flex items-center justify-center"}>
      <ChatPage userId={userId} sessionId={session.id} />
    </div>
  );
}
