// @refresh reload
import { Suspense } from "solid-js"
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  useLocation,
} from "solid-start"
import "./root.css"
import { signIn, signOut } from "@auth/solid-start/client"

import "@fontsource/poppins/100.css"
import "@fontsource/poppins/200.css"
import "@fontsource/poppins/300.css"
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/500.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/700.css"
import "@fontsource/poppins/800.css"
import "@fontsource/poppins/900.css"
import { useSession } from "./hooks/useSession"

export default function Root() {
  const location = useLocation()
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600"
  const currSession = useSession()
  const loggedIn = () => currSession() !== null && currSession() !== undefined

  // console.log(currSession(), loggedIn())

  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - With TailwindCSS</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <nav class="bg-sky-800">
              <ul class="container flex items-center p-3 text-gray-200">
                <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
                  <A href="/">Home</A>
                </li>
                <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
                  <A href="/about">About</A>
                </li>
                <li class={`border-b-2 ${active("/todo")} mx-1.5 sm:mx-6`}>
                  <A href="/todo">Todo</A>
                </li>
                <li class="ml-auto">
                  {loggedIn() ? (
                    <button
                      onClick={() => signOut()}
                      class="rounded bg-sky-600 px-3 py-2"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => signIn()}
                      class="rounded bg-sky-600 px-3 py-2"
                    >
                      Sign in
                    </button>
                  )}
                </li>
              </ul>
            </nav>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
