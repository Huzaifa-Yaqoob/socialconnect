"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registrationSchema } from "@/components/forms/auth/schena";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldRenderer } from "@/components/ui/bloom/field-renderer";
import { ReactCreatableSelect } from "@/components/ui/bloom/react-select-input";
import { useState } from "react";
import { uploadImageAction } from "@/lib/uploadFile";
import { updateUserSettings } from "@/lib/update";

// Default options for multi-select
const defaultOptions = [
  { value: "coding", label: "Coding" },
  { value: "reading", label: "Reading" },
];

const eeitSchema = registrationSchema
  .extend({ bio: z.string().optional(), avatar: z.string().optional() })
  .omit({ password: true });

function EditForm({ initialValues }: { initialValues: z.infer<typeof eeitSchema> }) {
  const form = useForm<z.infer<typeof eeitSchema>>({
    resolver: zodResolver(eeitSchema),
    defaultValues: { ...initialValues, bio: initialValues.bio || "" },
  });

  // State to manage avatar file
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof eeitSchema>) {
    // If there's an avatar file, upload it first

    // After uploading avatar, submit the rest of the form values
    console.log(values);
    const data = await updateUserSettings(values);
    if (data.error) {
      // setFormError(data.error, form);
    }
  }

  // Function to handle avatar file upload to the server (adjust as per your API)
  async function handleImageUpload(file: File) {
    // setUploading(true);
    const value = await uploadImageAction(file);
    if (value.success) {
      form.setValue("avatar", value.url);
      // setUploading(false);
    } else if (value.error) {
      form.setError("avatar", value.error);
      // setUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FieldRenderer label="Username">
              <Input {...field} />
            </FieldRenderer>
          )}
        />

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FieldRenderer label="Name">
              <Input {...field} />
            </FieldRenderer>
          )}
        />

        {/* Interests Field */}
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FieldRenderer label="Multi Select">
              <ReactCreatableSelect isMulti options={defaultOptions} {...field} />
            </FieldRenderer>
          )}
        />

        {/* Bio Field */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FieldRenderer label="Bio">
              <Input {...field} />
            </FieldRenderer>
          )}
        />

        {/* Avatar Upload Field */}
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FieldRenderer label="Avatar">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />
            </FieldRenderer>
          )}
        />

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default EditForm;
