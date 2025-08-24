import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PostForm from "@/components/forms/post/AddPost";
import { buttonVariants } from "@/components/ui/button";

function AddPostDialog() {
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "secondary" })}>Add</DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Post</DialogTitle>
        <PostForm />
      </DialogContent>
    </Dialog>
  );
}

export default AddPostDialog;
