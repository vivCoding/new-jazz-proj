import type { JSX } from "solid-js"
import { Show } from "solid-js"
import { useRouteData } from "solid-start"
import { useSession } from "~/hooks/useSession"

export const routeData = useSession

const Protected = (props: { children: JSX.Element }) => {
  const currSession = useRouteData<typeof routeData>()
  const loggedIn = () => currSession() !== null && currSession() !== undefined

  return (
    <>
      <Show when={loggedIn()} keyed>
        {props.children}
      </Show>
      <Show when={!loggedIn()} keyed>
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1>Not logged in noob</h1>
        </div>
      </Show>
    </>
  )
}

export default Protected
