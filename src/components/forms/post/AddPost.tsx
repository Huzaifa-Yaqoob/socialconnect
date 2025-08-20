"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImageAction } from "@/lib/uploadFile";
import { createPost } from "@/components/forms/post/action";

const postSchema = z.object({
  text: z.string().min(1, { message: "Text is required" }),
  imageUrl: z.string().url().optional(),
});

export default function PostForm() {
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      text: "",
      imageUrl: undefined,
    },
  });

  async function handleImageUpload(file: File) {
    setUploading(true);
    const value = await uploadImageAction(file);
    if (value.success) {
      form.setValue("imageUrl", value.url);
      setUploading(false);
    } else if (value.error) {
      form.setError("imageUrl", value.error);
      setUploading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof postSchema>) {
    // Now `values.imageUrl` already has uploaded image URL
    const data = await createPost(values);

    if (!data.success) {
      console.log(data);
    }
  }

  const imageUrl = form.watch("imageUrl");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-xl border p-4 shadow-sm"
      >
        {/* Text field */}
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Text</FormLabel>
              <FormControl>
                <Textarea placeholder="What's on your mind?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image field */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={() => (
            <FormItem>
              <FormLabel>Image (optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
              {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-40 w-40 rounded-md border object-cover"
                  />
                </div>
              )}
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={uploading}>
          Upload Post
        </Button>
      </form>
    </Form>
  );
}
