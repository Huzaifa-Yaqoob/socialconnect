"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema, registrationSchema } from "./schena";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldRenderer } from "@/components/ui/bloom/field-renderer";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/bloom/password-input";
import { login } from "@/components/forms/auth/action";
import setFormError from "@/lib/setFormErrors";
import { useRouter } from "next/navigation";

function Register() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const data = await login(values);
    if (data.error) {
      if (typeof data.error === "string") {
        console.log("error", data);
        return;
      } else {
        setFormError(data.error, form);
      }
    } else if (data?.data) {
      router.push("/" + data.data.username);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3 className={"text-center text-3xl font-bold"}>Log In</h3>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FieldRenderer label="Username">
              <Input {...field} />
            </FieldRenderer>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FieldRenderer label="Password">
              <PasswordInput {...field} />
            </FieldRenderer>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      If do'nt have any account,{" "}
      <Button variant={"link"} className={"m-0 p-0 text-base"}>
        <Link href={"/auth?form=register"}>Register</Link>
      </Button>
    </Form>
  );
}

export default Register;
