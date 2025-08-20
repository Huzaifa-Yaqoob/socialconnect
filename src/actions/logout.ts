"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  // Example: remove auth cookie
  const cookiesStore = await cookies();
  cookiesStore.delete("token");

  // redirect to login after logout
  redirect("/auth?form=login");
}
