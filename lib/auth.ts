import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For now, we'll use a simple check
        // In production, you should hash passwords and check against database
        // This is a basic implementation - you may want to add a users table
        // and proper password hashing (bcrypt, etc.)
        
        // Simple demo authentication - replace with proper user management
        // You can add a users table to the database schema if needed
        const validEmail = process.env.ADMIN_EMAIL || "admin@dispupr.local";
        const validPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (
          credentials.email === validEmail &&
          credentials.password === validPassword
        ) {
          return {
            id: "1",
            email: credentials.email,
            name: "Admin User",
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  debug: process.env.NODE_ENV === "development",
};

