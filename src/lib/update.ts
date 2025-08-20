"use server";

import { connectToDatabase } from "@/db/connect";
import User from "@/db/schemas/user.schema";
import { getSession } from "@/lib/getSession"; // Adjust import path based on your auth setup
import { revalidatePath } from "next/cache";
import handleMongooseValidationError from "@/lib/handleMongooseValidationError";
import { redirect } from "next/navigation";

interface Interest {
  value: string;
  _id?: string;
  label: string;
}

interface UpdateUserSettingsData {
  username: string;
  name?: string;
  avatar?: string;
  interests: Interest[];
}

interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function updateUserSettings(data: UpdateUserSettingsData) {
  console.log("asas", data);
  // return {
  //   success: true,
  //   data: {},
  // };
  try {
    // Get current user session
    const session = await getSession();

    if (!session?.id) {
      redirect("/auth?form=login");
    }

    // Connect to database
    await connectToDatabase();

    // Check if username is taken by another user
    if (data.username) {
      const existingUser = await User.findOne({
        username: data.username,
        _id: { $ne: session.id },
      });

      if (existingUser) {
        return {
          success: false,
          error: { username: "Username is already taken" },
        };
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (data.username) updateData.username = data.username.trim();
    if (data.name) updateData.name = data.name?.trim() || "";
    if (data.avatar) updateData.avatar = data.avatar?.trim() || "";
    if (data.interests) {
      // Remove _id from each interest object if it exists
      updateData.interests = data.interests.map((interest) => {
        if (!interest?._id) return interest;
        const { _id, ...rest } = interest; // Destructure and remove _id
        return rest;
      });
    }

    console.log(updateData, "okkk");

    // Update user
    await User.findByIdAndUpdate(session.id, updateData, {
      runValidators: true,
    });

    return {
      success: true,
      data: {},
    };
  } catch (error: any) {
    console.error("Error updating user settings:", error);

    return {
      success: false,
      error: handleMongooseValidationError(error),
    };
  }
}
