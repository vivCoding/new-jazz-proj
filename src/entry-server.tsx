import { redirect } from "solid-start"
import { getSession } from "@auth/solid-start"
import { signIn, signOut } from "@auth/solid-start/client"
import {
  StartServer,
  createHandler,
  renderAsync,
} from "solid-start/entry-server"
import { authOpts } from "./routes/api/auth/[...solidauth]"

const protectedPaths = [/^\/todo(\/(.*))*$/]

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      const pathname = new URL(event.request.url).pathname
      if (protectedPaths.some((pathReg) => pathname.search(pathReg) !== -1)) {
        // const user = await getUser(event.request);
        const session = await getSession(event.request, authOpts)
        if (!session || !session.user) {
          return redirect("/api/auth/signin")
          // return redirect(authOpts.pages?.signIn ?? "/") // a page for a non logged in user
        }
      }
      // if we got here, and the pathname is inside the `protectedPaths` array - a user is logged in
      return forward(event)
    }
  },
  renderAsync((event) => <StartServer event={event} />)
)
