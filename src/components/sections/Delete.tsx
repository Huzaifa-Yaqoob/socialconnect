"use client";

import { deletePost } from "@/components/forms/post/action";
import { Button } from "@/components/ui/button";

function Delete({ id }: { id: string }) {
  async function deletePostC(id: string) {
    await deletePost(id);
  }

  return (
    <Button variant={"destructive"} className={"ml-auto"} onClick={() => deletePostC(id)}>
      Delete
    </Button>
  );
}

export default Delete;
