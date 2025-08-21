import SearchPage from "@/components/sections/SearchPage";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  return <SearchPage currentUserId={session.id} />;
}
