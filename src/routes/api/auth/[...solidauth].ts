import type { SolidAuthConfig } from "@auth/solid-start"
import { SolidAuth } from "@auth/solid-start"
import GoogleProvider from "@auth/core/providers/google"
import prisma from "~/util/store/dbConnect"
import { PrismaAdapter } from "@auth/prisma-adapter"

export const authOpts: SolidAuthConfig = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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
}

export const { GET, POST } = SolidAuth(authOpts)
