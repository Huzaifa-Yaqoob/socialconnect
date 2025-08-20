"use server";

import { z } from "zod";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

import { registrationSchema, loginSchema } from "./schena";
import { connectToDatabase } from "@/db/connect";
import User from "@/db/schemas/user.schema";
import handleMongooseValidationError from "@/lib/handleMongooseValidationError";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret"; // ⚠️ store securely
const JWT_EXPIRES_IN = "7d"; // token lifetime

// ======================= REGISTER (Sign Up) =======================
export async function register(data: z.infer<typeof registrationSchema>) {
  try {
    await connectToDatabase();
    // Create user (password gets hashed in pre-save hook)
    const user = await User.create(data);

    console.log(user);

    // Create JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Store JWT in HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
      path: "/",
    });

    return { error: null, data: { id: user._id.toString(), username: user.username } };
  } catch (error) {
    console.log(error);
    return { error: handleMongooseValidationError(error), data: null };
  }
}

// ======================= LOGIN (Sign In) =======================
export async function login(data: z.infer<typeof loginSchema>) {
  console.log("run", data);
  try {
    await connectToDatabase();

    // Find user + explicitly select password
    const user = await User.findOne({ username: data.username }).select("+password");
    if (!user) {
      return { error: { username: "username not found", password: "" }, data: null };
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return { error: { password: "password incorrect", username: "" }, data: null };
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Store JWT in HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
      path: "/",
    });

    return { error: null, data: { id: user._id.toString(), username: user.username } };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong", data: null };
  }
}

export type ReturnType = {
  error: any;
  data: { _id: string; username: string };
};
