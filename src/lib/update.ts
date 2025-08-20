"use server";

import { connectToDatabase } from "@/db/connect";
import User from "@/db/schemas/user.schema";
import { getSession } from "@/lib/getSession"; // Adjust import path based on your auth setup
import { revalidatePath } from "next/cache";

interface Interest {
  value: string;
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

export async function updateUserSettings(data: UpdateUserSettingsData): Promise<ActionResult> {
  try {
    // Get current user session
    const session = await getSession();

    if (!session?.id) {
      return {
        success: false,
        error: "Authentication required",
      };
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
          error: "Username is already taken",
        };
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (data.username) updateData.username = data.username.trim();
    if (data.name !== undefined) updateData.name = data.name?.trim() || "";
    if (data.avatar !== undefined) updateData.avatar = data.avatar?.trim() || "";
    if (data.interests) updateData.interests = data.interests;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(session.id, updateData, {
      new: true,
      runValidators: true,
      select: "username name avatar interests createdAt updatedAt",
    });

    if (!updatedUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Revalidate relevant paths
    revalidatePath("/settings");
    revalidatePath("/profile");

    return {
      success: true,
      data: {
        username: updatedUser.username,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        interests: updatedUser.interests,
      },
    };
  } catch (error: any) {
    console.error("Error updating user settings:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0] as any;
      return {
        success: false,
        error: firstError?.message || "Validation failed",
      };
    }

    // Handle duplicate key error (username)
    if (error.code === 11000) {
      return {
        success: false,
        error: "Username is already taken",
      };
    }

    return {
      success: false,
      error: "Failed to update settings. Please try again.",
    };
  }
}

export async function getCurrentUserSettings(): Promise<ActionResult> {
  try {
    // Get current user session
    const session = await getSession();

    if (!session?.id) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Connect to database
    await connectToDatabase();

    // Get current user data
    const user = await User.findById(session.id).select(
      "username name avatar interests createdAt updatedAt"
    );

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      data: {
        username: user.username,
        name: user.name || "",
        avatar: user.avatar || "",
        interests: user.interests || [],
      },
    };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return {
      success: false,
      error: "Failed to fetch user settings",
    };
  }
}
