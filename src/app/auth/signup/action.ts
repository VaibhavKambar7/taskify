"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupInput = z.infer<typeof SignupSchema>;

export async function signup(data: SignupInput) {
  try {
     const validatedData = SignupSchema.parse(data);

     const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

     const hashedPassword = await bcrypt.hash(validatedData.password, 10);

     const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return { data: user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Something went wrong. Please try again." };
  }
}
