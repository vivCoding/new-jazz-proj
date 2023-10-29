import { getSession } from "@auth/solid-start"
import { createServerData$, redirect } from "solid-start/server"
import { authOpts } from "~/routes/api/auth/[...solidauth]"

export const useSession = (protect?: boolean) => {
  return createServerData$(
    async ([protect], { request }) => {
      console.log("checkin session")
      const session = await getSession(request, authOpts)
      if (protect && (!session || !session.user)) {
        throw redirect("/401")
      }
      return session
    },
    { key: () => [protect] }
  )
}
