import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { analyticsEventNames } from "@/lib/analytics/events";
import { trackServerEvent } from "@/lib/analytics/server";
import { prisma } from "@/lib/db";

export const isGoogleAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

export const isEmailAuthEnabled = Boolean(
  process.env.EMAIL_SERVER && process.env.EMAIL_FROM
);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(isEmailAuthEnabled
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER!,
            from: process.env.EMAIL_FROM!,
          }),
        ]
      : []),
    ...(isGoogleAuthEnabled
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && (token.id || token.sub)) {
        session.user.id = token.id ?? token.sub!;
      }

      return session;
    },
  },
  events: {
    async signIn(message) {
      await trackServerEvent(analyticsEventNames.signIn, {
        provider: message.account?.provider ?? "unknown",
        is_new_user: Boolean(message.isNewUser),
      });
    },
  },
};
