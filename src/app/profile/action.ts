"use server";

import { getServerSession } from "next-auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { authOptions } from "../api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name || name.length < 2) {
      return {
        success: false,
        error: "Name must be at least 2 characters",
      };
    }

    let imageUrl: string | undefined;
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageUrl = await uploadToCloudinary(buffer);
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        ...(imageUrl && { image: imageUrl }),
      },
      select: {
        name: true,
        email: true,
        image: true,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/");

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: "Failed to update profile",
    };
  }
}
