"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginInput = z.infer<typeof LoginSchema>;

export async function login(data: LoginInput) {
  try {
    const validatedData = LoginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (
      !user ||
      !(await bcrypt.compare(validatedData.password, user.hashedPassword))
    ) {
      return { error: "Invalid email or password." };
    }

    return { name: user.name, email: user.email, image: user.image };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Something went wrong. Please try again." };
  }
}
