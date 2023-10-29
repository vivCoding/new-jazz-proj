import { signIn, signOut } from "@auth/solid-start/client"
import { A, Outlet, useLocation, useRouteData } from "solid-start"
import { useSession } from "~/hooks/useSession"

export const routeData = () => {
  return useSession()
}

export default function IndexLayout() {
  const location = useLocation()
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600"

  const currSession = useRouteData<typeof routeData>()
  const loggedIn = () => currSession() !== null && currSession() !== undefined

  return (
    <div>
      <nav class="bg-sky-800">
        <ul class="container flex items-center p-3 text-gray-200">
          <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
            <A href="/">Home</A>
          </li>
          <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
            <A href="/about">About</A>
          </li>
          {loggedIn() && (
            <li class={`border-b-2 ${active("/todo")} mx-1.5 sm:mx-6`}>
              <A href="/todo">Todo</A>
            </li>
          )}
          <li class="ml-auto">
            {loggedIn() ? (
              <>
                <button
                  onClick={() =>
                    signOut({
                      callbackUrl: "/",
                    })
                  }
                  class="rounded bg-sky-600 px-3 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                class="rounded bg-sky-600 px-3 py-2"
              >
                Sign in
              </button>
            )}
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}
