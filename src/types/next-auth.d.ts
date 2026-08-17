import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "VIEWER" | "EDITOR" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      role: "VIEWER" | "EDITOR" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "VIEWER" | "EDITOR" | "ADMIN";
  }
}
