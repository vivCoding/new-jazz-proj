import { getSession } from "@auth/solid-start"
import type { Car } from "@prisma/client"
import { For, Show, createSignal } from "solid-js"
import { useRouteData } from "solid-start"
import { createServerAction$, createServerData$ } from "solid-start/server"
import Protected from "~/components/Protected"
import {
  addCar as addCarDb,
  deleteCar as deleteCarDb,
  getCarsFromUser,
} from "~/controllers/car"
import { authOpts } from "~/routes/api/auth/[...solidauth]"
import to from "await-to-js"
import toast from "solid-toast"

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const session = await getSession(request, authOpts)
    const [err, res] = await to(getCarsFromUser(session?.user?.id ?? ""))
    return { err, res }
  })
}

export default function Dashboard() {
  const [adding, setAdding] = createSignal(false)
  const [newCarName, setNewCarName] = createSignal("")
  const [newCarDesc, setNewCarDesc] = createSignal("")

  const cars = useRouteData<typeof routeData>()

  const [addStatus, addNew] = createServerAction$(
    async (newCar: Omit<Car, "id" | "userId">, { request }) => {
      console.log("adding new car")
      const session = await getSession(request, authOpts)
      const [err, res] = await to(
        addCarDb({ ...newCar, userId: session?.user?.id ?? "" })
      )
      if (err || !res) throw err
    }
  )

  const [deleteStatus, deleteCar] = createServerAction$(
    async (carId: string) => {
      console.log("deleting a car")
      const [err, res] = await to(deleteCarDb(carId))
      if (err || !res) throw err
    }
  )

  const handleAddNewCar = async () => {
    await addNew({
      name: newCarName(),
      description: newCarDesc(),
    })
    if (addStatus.error) {
      toast.error("Something went wrong with adding your car 😢")
    } else {
      toast.success("Added your car 😎")
      handleCancelAdd()
    }
  }

  const clearInputs = () => {
    setNewCarName("")
    setNewCarDesc("")
  }

  const handleCancelAdd = () => {
    setAdding(false)
    clearInputs()
  }

  const handleDeleteCar = async (carId: string) => {
    await deleteCar(carId)
    if (deleteStatus.error) {
      toast.error("Something went wrong with deleting the car 😢")
    } else {
      toast.success("Deleted your car 😈")
    }
  }

  if (cars() && cars()?.err) {
    toast.error("Could not load cars and refuel info 😭")
  }

  return (
    <Protected>
      <main class="p-14 text-gray-700">
        <div class="flex flex-row items-center justify-between">
          <h1 class="text-5xl font-light">My Cars</h1>
          <button
            class="block rounded bg-sky-600 px-3 py-2 text-white transition hover:bg-sky-400"
            onClick={() => (setAdding(true), clearInputs())}
          >
            Add New Car
          </button>
        </div>
        <div class="mt-6">
          <Show when={cars()?.res && cars()?.res?.length === 0}>
            <h3 class="text-xl font-light italic">No cars</h3>
          </Show>
          <For each={cars()?.res}>
            {(car) => (
              <div class="my-2 flex flex-row items-center justify-between rounded bg-slate-200 p-4">
                <div>
                  <h3 class="text-lg font-medium">{car.name}</h3>
                  <h3 class="font-light italic">{car.description}</h3>
                </div>
                <button
                  class="rounded bg-red-500 p-2 text-white transition enabled:hover:bg-red-800 disabled:opacity-60 disabled:hover:cursor-not-allowed"
                  onClick={() => handleDeleteCar(car.id)}
                  disabled={
                    deleteStatus.pending && deleteStatus.input === car.id
                  }
                >
                  {deleteStatus.pending && deleteStatus.input === car.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            )}
          </For>
        </div>
      </main>
      {/* TODO replace with daisyUI modal */}
      <Show when={adding()}>
        <div
          class="fixed left-0 top-0 h-screen w-screen bg-black/70"
          onClick={handleCancelAdd}
        >
          <div
            class="absolute left-1/2 top-1/2 max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-scroll rounded-lg border-4 border-slate-300 bg-white p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 class="text-3xl font-light">Add New Car</h1>
            <form onSubmit={(e) => e.preventDefault()}>
              <div class="mt-4">
                <h3 class="font-medium">Name</h3>
                <input
                  class="mt-1 block w-full rounded border border-slate-400 p-1 text-sm font-light disabled:bg-slate-100 disabled:hover:cursor-not-allowed"
                  value={newCarName()}
                  onChange={(e) => setNewCarName(e.target.value)}
                  disabled={addStatus.pending}
                />
              </div>
              <div class="mt-4">
                <h3 class="font-medium">Description</h3>
                <textarea
                  class="mt-1 block w-full rounded border border-slate-400 p-2 text-sm font-light disabled:bg-slate-100 disabled:hover:cursor-not-allowed"
                  value={newCarDesc()}
                  onChange={(e) => setNewCarDesc(e.target.value)}
                  disabled={addStatus.pending}
                />
              </div>
              <div class="mt-6 flex flex-row">
                <button
                  type="submit"
                  class="block rounded bg-slate-300 px-3 py-2  transition enabled:hover:bg-slate-200 disabled:opacity-60 disabled:hover:cursor-not-allowed"
                  onClick={handleCancelAdd}
                  disabled={addStatus.pending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="ml-auto block rounded bg-sky-600 px-3 py-2 text-white transition enabled:hover:bg-sky-400  disabled:opacity-60 disabled:hover:cursor-not-allowed"
                  onClick={handleAddNewCar}
                  disabled={addStatus.pending}
                >
                  {addStatus.pending ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </Protected>
  )
}
