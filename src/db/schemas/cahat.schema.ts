import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChatMessage extends Document {
  chatId: string;
  text: string;
  sender: Types.ObjectId;
  createdAt: Date;
}

const ChatSchema = new Schema<IChatMessage>(
  {
    chatId: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model<IChatMessage>("Chat", ChatSchema);
