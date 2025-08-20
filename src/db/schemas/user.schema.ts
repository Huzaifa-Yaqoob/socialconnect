import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  password: string;
  avatar?: string;
  name?: string;
  interests: string[];

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username must be at most 20 characters long"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // prevent returning password in queries by default
    },
    avatar: {
      type: String,
      validate: {
        validator: (v: string) => {
          if (!v) return true; // allow empty/undefined
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: "Avatar must be a valid URL",
      },
    },
    name: {
      type: String,
      maxlength: [50, "Name must be at most 50 characters long"],
      trim: true,
    },
    interests: {
      type: [
        {
          value: { type: String, required: true },
          label: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
