import type { JSX } from "solid-js"
import { Show } from "solid-js"
import { useSession } from "~/hooks/useSession"

// somewhat protects, but some client side stuff still runs in client routing
export const Protected = (props: { children: JSX.Element }) => {
  const session = useSession(true)

  // still runs during client routing
  // console.log("bruh")

  return (
    <Show when={session()} keyed>
      <>{props.children}</>
    </Show>
  )
}

export default Protected
