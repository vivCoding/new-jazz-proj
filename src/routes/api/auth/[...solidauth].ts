import type { SolidAuthConfig } from "@auth/solid-start"
import { SolidAuth } from "@auth/solid-start"
import GoogleProvider from "@auth/core/providers/google"
import prisma from "~/util/store/dbConnect"
import { PrismaAdapter } from "@auth/prisma-adapter"

export const authOpts: SolidAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
}

export const { GET, POST } = SolidAuth(authOpts)
