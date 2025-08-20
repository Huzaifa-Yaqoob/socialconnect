"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registrationSchema } from "./schena";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldRenderer } from "@/components/ui/bloom/field-renderer";
import Link from "next/link";
import { ReactCreatableSelect } from "@/components/ui/bloom/react-select-input";
import { PasswordInput } from "@/components/ui/bloom/password-input";
import { register, type ReturnType } from "@/components/forms/auth/action";
import setFormError from "@/lib/setFormErrors";
import { useRouter } from "next/navigation";

const defaultOptions = [
  { value: "coding", label: "Coding" },
  { value: "reading", label: "Reading" },
];

function EditForm({ initialValues }: { initialValues: z.infer<typeof registrationSchema> }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      name: "",
      password: "",
      interests: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const data = await register(values);
    if (data.error) {
      setFormError(data.error, form);
    } else if (data?.data) {
      router.push("/" + data.data.username);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3 className={"text-center text-3xl font-bold"}>Register</h3>
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
          name="name"
          render={({ field }) => (
            <FieldRenderer label="Name">
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

        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FieldRenderer label="Multi Select">
              <ReactCreatableSelect isMulti options={defaultOptions} {...field} />
            </FieldRenderer>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
      If already have an account,{" "}
      <Button variant={"link"} className={"m-0 p-0 text-base"}>
        <Link href={"/auth?form=login"}>Log In</Link>
      </Button>
    </Form>
  );
}

export default Register;
