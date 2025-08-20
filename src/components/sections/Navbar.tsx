"use client";

import { logout } from "@/actions/logout";
import AddPostDialog from "@/components/forms/post/AddPostDialog";

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow">
      <div className="text-xl font-bold">MyApp</div>
      <div className={"flex items-center gap-4"}>
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
