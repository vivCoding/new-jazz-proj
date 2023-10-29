import "reflect-metadata"
import type { SolidAuthConfig } from "@auth/solid-start"
import { SolidAuth } from "@auth/solid-start"
import GoogleProvider from "@auth/core/providers/google"
import { TypeORMAdapter } from "@auth/typeorm-adapter"

export const authOpts: SolidAuthConfig = {
  adapter: TypeORMAdapter({
    type: "cockroachdb",
    url: process.env.COCKROACHDB_URL || "",
    timeTravelQueries: false,
    ssl: true,
    synchronize: false,
  }),
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
