import { openChat, getMessages } from "@/actions/chats";
import { getSession } from "@/lib/getSession";
import ChatWindow from "@/components/sections/ChatWindow";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  const session = await getSession();

  if (!session?.id) {
    redirect("/auth/?form=login");
  }

  const { userId } = await params;

  const chat = await openChat(session.id, userId);
  const initialMessages = await getMessages(chat._id);

  return (
    <div className="flex-grow px-4 py-6">
      <ChatWindow chatId={chat._id} currentUserId={session.id} initialMessages={initialMessages} />
    </div>
  );
}
