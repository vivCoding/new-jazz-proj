import { redirect } from "solid-start"
import { getSession } from "@auth/solid-start"
import {
  StartServer,
  createHandler,
  renderAsync,
} from "solid-start/entry-server"
import { authOpts } from "./routes/api/auth/[...solidauth]"
import { getToken } from "@auth/core/jwt"

const protectedPaths = [/^\/todo(\/(.*))*$/]

// NOTE middleware doesn't work for internal routing
// https://github.com/solidjs/solid-start/issues/949
// not very good smh
export default createHandler(
  // ({ forward }) => {
  //   return async (event) => {
  //     console.log("hmm", event.request.url)
  //     const pathname = new URL(event.request.url).pathname
  //     if (protectedPaths.some((pathReg) => pathname.search(pathReg) !== -1)) {
  //       const token = await getToken({ req: event.request })
  //       if (!token) {
  //         return redirect("/") // a page for a non logged in user
  //       }
  //     }
  //     return forward(event)
  //   }
  // },
  renderAsync((event) => <StartServer event={event} />)
)
