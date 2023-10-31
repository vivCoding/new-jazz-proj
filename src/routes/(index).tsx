import { signIn, signOut } from "@auth/solid-start/client"
import { Show } from "solid-js"
import { A, Outlet, useLocation } from "solid-start"
import { useSession } from "~/hooks/useSession"

export default function IndexLayout() {
  const location = useLocation()
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600"

  const currSession = useSession()
  const loggedIn = () => currSession() !== null && currSession() !== undefined

  return (
    <div>
      <nav class="bg-sky-800">
        <ul class="flex w-full flex-row items-center gap-x-9 p-3 px-6 text-gray-200">
          <li class={`border-b-2 ${active("/")} block`}>
            <A href="/">Home</A>
          </li>
          <li class={`border-b-2 ${active("/about")} block`}>
            <A href="/about">About</A>
          </li>
          <Show when={loggedIn()}>
            <li class={`border-b-2 ${active("/todo")} block`}>
              <A href="/dashboard">Dashboard</A>
            </li>
          </Show>
          <li class="ml-auto">
            {loggedIn() ? (
              <div class="flex flex-row items-center">
                <h3>{currSession()?.user?.name}</h3>
                <img
                  class="ml-4 w-10 rounded-full drop-shadow-lg"
                  src={currSession()?.user?.image ?? ""}
                />
                <button
                  class="ml-6 rounded bg-sky-600 px-3 py-2 transition hover:bg-sky-500"
                  onClick={() =>
                    signOut({
                      callbackUrl: "/",
                    })
                  }
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                class="rounded bg-sky-600 px-3 py-2 transition hover:bg-sky-500"
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
