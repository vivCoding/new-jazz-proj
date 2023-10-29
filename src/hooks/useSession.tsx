import { getToken } from "@auth/core/jwt"
import { getSession } from "@auth/solid-start"
import { createServerData$ } from "solid-start/server"
import { authOpts } from "~/routes/api/auth/[...solidauth]"

export const useSession = () => {
  return createServerData$(
    async (_, { request }) => {
      const data = await getSession(request, authOpts)
      return data
    },
    { key: () => ["auth_user"] }
  )
}
