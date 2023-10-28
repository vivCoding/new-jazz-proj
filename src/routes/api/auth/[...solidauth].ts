import "reflect-metadata"
import type { SolidAuthConfig } from "@auth/solid-start"
import { SolidAuth } from "@auth/solid-start"
import GoogleProvider from "@auth/core/providers/google"
import CredentialsProvider from "@auth/core/providers/google"
import { TypeORMAdapter } from "@auth/typeorm-adapter"

console.log("hmm cdb", process.env.COCKROACHDB_URL)

export const authOpts: SolidAuthConfig = {
  adapter: TypeORMAdapter({
    type: "cockroachdb",
    url: process.env.COCKROACHDB_URL || "",
    timeTravelQueries: false,
    ssl: true,
    synchronize: true,
    logging: true,
    // username: process.env.COCKROACHDB_USER || "",
    // host: process.env.COCKROACHDB_HOST || "",
    // port: parseInt(process.env.COCKROACHDB_PORT || "0"),
    // database: "users",
    // password: process.env.COCKROACHDB_PWD || "",
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
  // pages: {
  //   signIn: "/login",
  // },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  debug: true,
}

export const { GET, POST } = SolidAuth(authOpts)
