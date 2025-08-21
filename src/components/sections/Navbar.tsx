"use client";

import { logout } from "@/actions/logout";
import AddPostDialog from "@/components/forms/post/AddPostDialog";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow">
      <div className="text-xl font-bold">MyApp</div>
      <div className={"flex items-center gap-4"}>
        <Link href={`/settings`} className={buttonVariants({ variant: "link" })}>
          Settings
        </Link>
        <Link href={`/suggestions`} className={buttonVariants({ variant: "link" })}>
          Suggestions
        </Link>
        <AddPostDialog />
        <form action={logout}>
          <button
            type="submit"
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
