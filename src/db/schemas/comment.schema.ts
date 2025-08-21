// models/Comment.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  text: string;
  owner: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    text: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
