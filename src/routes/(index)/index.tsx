import { signIn } from "@auth/solid-start/client"
import { A } from "solid-start"
import { useSession } from "~/hooks/useSession"

export default function Home() {
  const session = useSession()

  return (
    <main class="mx-auto p-4 text-center text-gray-700">
      <h1 class="max-6-xs mb-8 mt-16 text-6xl font-light text-sky-700">
        MyTank
      </h1>
      {!session() ? (
        <p>
          <button
            onClick={() => signIn("google")}
            class="text-sky-600 hover:underline"
          >
            Sign in
          </button>{" "}
          to get started
        </p>
      ) : (
        <>
          <p>Welcome back you piece of garbo</p>
          <p>
            Go to{" "}
            <A href="/dashboard" class="text-sky-600 hover:underline">
              dashboard
            </A>
          </p>
        </>
      )}
    </main>
  )
}
