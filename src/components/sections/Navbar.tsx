import { logout } from "@/actions/logout";
import AddPostDialog from "@/components/forms/post/AddPostDialog";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/lib/getSession";
import { connectToDatabase } from "@/db/connect";
import User from "@/db/schemas/user.schema";
import { redirect } from "next/navigation";

async function Navbar() {
  const session = await getSession();
  await connectToDatabase();

  let user = null;
  if (session?.id) {
    user = await User.findById(session.id);
  }

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow">
      <Link
        href={`/${user && user?.username ? user?.username : "/"}`}
        className="text-xl font-bold"
      >
        MyApp
      </Link>
      <div className={"flex items-center gap-4"}>
        {session?.id && (
          <>
            <Link href={`/search`} className={buttonVariants({ variant: "link" })}>
              Search
            </Link>
            <Link href={`/mine`} className={buttonVariants({ variant: "link" })}>
              My Connections
            </Link>
            <Link href={`/settings`} className={buttonVariants({ variant: "link" })}>
              Settings
            </Link>
            <Link href={`/suggestions`} className={buttonVariants({ variant: "link" })}>
              Suggestions
            </Link>
          </>
        )}
        <AddPostDialog />
        {session?.id ? (
          <form action={logout}>
            <button
              type="submit"
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </form>
        ) : (
          <Link href={`/auth`} className={buttonVariants({ variant: "default" })}>
            Suggestions
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
