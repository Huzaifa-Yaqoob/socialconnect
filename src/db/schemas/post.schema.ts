// models/Post.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  text: string;
  image?: string;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema<IPost> = new Schema(
  {
    text: {
      type: String,
      required: [true, "Post text is required"],
      trim: true,
    },
    image: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
``;
