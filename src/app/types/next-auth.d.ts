import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    email?: string;
    name?: string;
    image?: string;
  }
  interface Session {
    user: {
      email?: string;
      name?: string;
      image?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
     email?: string;
    name?: string;
    image?: string;
  }
}
