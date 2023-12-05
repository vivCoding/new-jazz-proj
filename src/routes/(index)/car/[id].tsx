import type { Refuel } from "@prisma/client"
import to from "await-to-js"
import { For, Show, createSignal } from "solid-js"
import { useParams, useRouteData } from "solid-start"
import { createServerAction$, createServerData$ } from "solid-start/server"
import toast from "solid-toast"
import Protected from "~/components/Protected"
import { getCarById } from "~/controllers/car"
import {
  addRefuel as addRefuelDb,
  deleteRefuel as deleteRefuelDb,
} from "~/controllers/refuel"

export function routeData() {
  const params = useParams()
  return createServerData$(
    async (id) => {
      const [err, res] = await to(getCarById(id))
      return { err, res }
    },
    { key: () => params.id }
  )
}

export default function CarPage() {
  const car = useRouteData<typeof routeData>()

  const [adding, setAdding] = createSignal(false)
  const [newDate, setDate] = createSignal(new Date())
  const [newGallons, setGallons] = createSignal(0)
  const [newPrice, setPrice] = createSignal(0)
  const [newMilesDriven, setMilesDriven] = createSignal(0)

  const [addStatus, addNew] = createServerAction$(
    async (newRefuel: Omit<Refuel, "id" | "mpg" | "costPerMile">) => {
      console.log("adding new refuel")
      const [err, res] = await to(addRefuelDb({ ...newRefuel }))
      if (err || !res) throw err
    }
  )

  const [deleteStatus, deleteRefuel] = createServerAction$(
    async (refuelId: string) => {
      console.log("deleting a refuel")
      const [err, res] = await to(deleteRefuelDb(refuelId))
      if (err || !res) throw err
    }
  )

  const handleAddNewRefuel = async () => {
    await addNew({
      carId: car()?.res?.id ?? "",
      date: newDate(),
      gallons: newGallons(),
      gallonPrice: newPrice(),
      milesDriven: newMilesDriven(),
    })
    if (addStatus.error) {
      toast.error("Something went wrong with adding your refuel info 😢")
    } else {
      toast.success("Added your refuel info 😎")
      handleCancelAdd()
    }
  }

  const handleCancelAdd = () => {
    setAdding(false)
    clearInputs()
  }

  const clearInputs = () => {
    setGallons(0)
    setPrice(0)
    setMilesDriven(0)
  }

  const handleDeleteRefuel = async (refuelId: string) => {
    await deleteRefuel(refuelId)
    if (deleteStatus.error) {
      toast.error("Something went wrong with deleting the refuel info 😢")
    } else {
      toast.success("Deleted your refuel info 😈")
    }
  }

  if (car() && (car()?.err || !car()?.res)) {
    toast.error("Could not load car and car refuel info 😭")
  } else {
    car()?.res?.refuels.forEach((refuel) => {
      refuel.date = new Date(refuel.date)
    })
  }

  return (
    <Protected>
      <main class="p-14 text-gray-700">
        <div class="flex flex-row items-center justify-between">
          <div>
            <h1 class="text-5xl font-light">{car()?.res?.name}</h1>
            <h3 class="mt-3 text-xl font-light">{car()?.res?.description}</h3>
          </div>
          <button
            class="block rounded bg-sky-600 px-3 py-2 text-white transition hover:bg-sky-400"
            onClick={() => (setAdding(true), clearInputs())}
          >
            Add Refuel Info
          </button>
        </div>
        <div class="mt-6">
          <table class="w-full">
            <thead>
              <tr>
                <th class="border-2 border-solid border-white bg-slate-300 p-2 font-normal">
                  <h3>Date</h3>
                </th>
                <th class="border-2 border-solid border-white bg-slate-300 p-2 font-normal">
                  <h3>Price/Gallon</h3>
                </th>
                <th class="border-2 border-solid border-white bg-slate-300 p-2 font-normal">
                  <h3>Gallons</h3>
                </th>
                <th class="border-2 border-solid border-white bg-slate-300 p-2 font-normal">
                  <h3>Miles Driven</h3>
                </th>
                <th class="border-2 border-solid border-white bg-slate-300 p-2 font-normal">
                  <h3>MPG</h3>
                </th>
                <th class="border-2 border-solid border-white bg-slate-300 p-2 font-normal">
                  <h3>Cost/Mile</h3>
                </th>
                <th class="w-0"> </th>
              </tr>
            </thead>
            <For each={car()?.res?.refuels}>
              {({
                id: refuelId,
                date,
                gallons,
                gallonPrice,
                milesDriven,
                mpg,
                costPerMile,
              }) => (
                <>
                  <tr>
                    <td class=" border-2 border-gray-200 p-1">
                      {new Date(date).toLocaleDateString()}
                    </td>
                    <td class=" border-2 border-gray-200 p-1">{gallonPrice}</td>
                    <td class=" border-2 border-gray-200 p-1">{gallons}</td>
                    <td class=" border-2 border-gray-200 p-1">{milesDriven}</td>
                    <td class=" border-2 border-gray-200 p-1">{mpg}</td>
                    <td class=" border-2 border-gray-200 p-1">{costPerMile}</td>
                    <td class="inline">
                      <button
                        class="m-1 rounded bg-red-500 p-2 text-white transition enabled:hover:bg-red-800 disabled:opacity-60 disabled:hover:cursor-not-allowed"
                        title="Delete refuel info"
                        onClick={() => handleDeleteRefuel(refuelId)}
                        disabled={
                          deleteStatus.pending &&
                          deleteStatus.input === refuelId
                        }
                      >
                        {deleteStatus.pending &&
                        deleteStatus.input === refuelId ? (
                          <svg
                            class="animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                </>
              )}
            </For>
          </table>
          <Show when={car()?.res?.refuels.length === 0}>
            <h3 class="mt-2 text-center text-xl font-light italic">
              No refuels
            </h3>
          </Show>
        </div>
      </main>
      <Show when={adding()}>
        <div
          class="fixed left-0 top-0 h-screen w-screen bg-black/70"
          onClick={handleCancelAdd}
        >
          <div
            class="absolute left-1/2 top-1/2 max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-scroll rounded-lg border-4 border-slate-300 bg-white p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 class="text-3xl font-light">Add New Refuel Info</h1>
            <form onSubmit={(e) => e.preventDefault()}>
              <div class="mt-4">
                <h3 class="font-medium">Date</h3>
                <input
                  type="date"
                  class="mt-1 block w-full rounded border border-slate-400 p-1 text-sm font-light disabled:bg-slate-100 disabled:hover:cursor-not-allowed"
                  value={newDate()
                    .toLocaleDateString("en-ZA")
                    .replaceAll("/", "-")}
                  onChange={(e) => {
                    setDate(
                      new Date(e.target.value.replaceAll("-", "/")) ??
                        new Date()
                    )
                  }}
                  disabled={addStatus.pending}
                />
              </div>
              <div class="mt-4">
                <h3 class="font-medium">Gallons Filled</h3>
                <input
                  type="number"
                  class="mt-1 block w-full rounded border border-slate-400 p-1 text-sm font-light disabled:bg-slate-100 disabled:hover:cursor-not-allowed"
                  value={newGallons()}
                  onChange={(e) => setGallons(e.target.valueAsNumber)}
                  disabled={addStatus.pending}
                />
              </div>
              <div class="mt-4">
                <h3 class="font-medium">Gallon Price</h3>
                <input
                  type="number"
                  class="mt-1 block w-full rounded border border-slate-400 p-1 text-sm font-light disabled:bg-slate-100 disabled:hover:cursor-not-allowed"
                  value={newPrice()}
                  onChange={(e) => setPrice(e.target.valueAsNumber)}
                  disabled={addStatus.pending}
                />
              </div>
              <div class="mt-4">
                <h3 class="font-medium">Miles Driven</h3>
                <input
                  type="number"
                  class="mt-1 block w-full rounded border border-slate-400 p-1 text-sm font-light disabled:bg-slate-100 disabled:hover:cursor-not-allowed"
                  value={newMilesDriven()}
                  onChange={(e) => setMilesDriven(e.target.valueAsNumber)}
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
                  onClick={handleAddNewRefuel}
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
