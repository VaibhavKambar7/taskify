import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";

dotenv.config();

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", placeholder: "Enter Email" },
        password: { label: "Password", placeholder: "Enter Password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password)
          return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user) {
          const passwordMatch = await bcryptjs.compare(
            credentials.password,
            user.password
          );
          if (!passwordMatch) return null;
          return { id: user.id, email: user.email };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
