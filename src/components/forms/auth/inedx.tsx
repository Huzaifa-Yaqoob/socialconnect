"use client";

import Register from "@/components/forms/auth/Register";
import LogIn from "@/components/forms/auth/LogIn";
import { useSearchParams } from "next/navigation";

function AuthForm() {
  const searchParams = useSearchParams();
  const form = searchParams.get("form");

  return <div className={"min-w-[500px]"}>{form === "login" ? <LogIn /> : <Register />}</div>;
}

export default AuthForm;
