import { createSignal } from "solid-js"
import { A } from "solid-start"

export default function CreateAcct() {
  const [newUsername, setNewUsername] = createSignal("")
  const [newPassword, setNewPassword] = createSignal("")

  const handleCreateAcct = () => {
    // TODO handle create acct
  }

  return (
    <main class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div class="rounded-lg border-4 border-slate-300 px-8 py-4">
        <h1 class="my-8 text-center text-4xl font-semibold">Create Account</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div class="mt-4">
            <h3 class="font-medium">Username</h3>
            <input
              class="mt-1 block w-full rounded border border-slate-400 p-2 text-sm font-light"
              value={newUsername()}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div class="mt-4">
            <h3 class="font-medium">Password</h3>
            <input
              class="mt-1 block w-full rounded border border-slate-400 p-2 text-sm font-light"
              type="password"
              value={newPassword()}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <div class="mt-4">
            <h3 class="font-medium">Confirm Password</h3>
            <input
              class="mt-1 block w-full rounded border border-slate-400 p-2 text-sm font-light"
              type="password"
              value={newPassword()}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <div class="mt-6 flex flex-row items-center">
            <A
              href="/account/create"
              class="text-xs underline transition hover:text-blue-500"
            >
              Login with existing account
            </A>
            <button
              type="submit"
              class="ml-auto block rounded bg-sky-600 px-3 py-2 text-white transition hover:bg-sky-400"
              onClick={handleCreateAcct}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
