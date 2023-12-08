import { getSession } from "@auth/solid-start"
import type { Refuel } from "@prisma/client"
import to from "await-to-js"
import { For, Show, createEffect, createSignal } from "solid-js"
import { refetchRouteData, useParams, useRouteData } from "solid-start"
import { useSearchParams } from "solid-start/router"
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server"
import toast from "solid-toast"
import Protected from "~/components/Protected"
import { getCarById } from "~/controllers/car"
import {
  addRefuel as addRefuelDb,
  deleteRefuel as deleteRefuelDb,
  getRefuelsFromCar,
} from "~/controllers/refuel"
import { authOpts } from "~/routes/api/auth/[...solidauth]"

enum FilterType {
  ALL = "all",
  ONE_MONTH = "oneMonth",
  ONE_YEAR = "oneYear",
  CUSTOM = "custom",
}

type SearchParamsType = {
  filterType: FilterType
  startDate?: string
  endDate?: string
}

export function routeData() {
  const params = useParams()
  const [searchParams] = useSearchParams<SearchParamsType>()
  return createServerData$(
    async ({ params, searchParams }, { request }) => {
      const session = await getSession(request, authOpts)

      const [err, car] = await to(getCarById(params.id))
      if (err || !car) throw err ?? "no car"
      // prevent other users from seeing car
      if (!session || !session.user || car.userId !== session.user.id) {
        throw redirect("/401")
      }
      const {
        filterType,
        startDate: customDateStart,
        endDate: customDateEnd,
      } = searchParams
      let startDate: Date | undefined = undefined
      let endDate: Date | undefined = undefined

      switch (filterType) {
        case FilterType.ALL:
          break
        case FilterType.ONE_MONTH:
          endDate = new Date()
          startDate = new Date(new Date().setMonth(endDate.getMonth() - 1))
          break
        case FilterType.ONE_YEAR:
          endDate = new Date()
          startDate = new Date(
            new Date().setFullYear(endDate.getFullYear() - 1)
          )
          break
        case FilterType.CUSTOM:
          if (customDateStart && customDateEnd) {
            startDate = new Date(customDateStart)
            endDate = new Date(customDateEnd)
          }
          break
      }

      const [err2, refuels] = await to(
        getRefuelsFromCar(params.id, startDate, endDate)
      )
      if (err2 || !refuels) throw err ?? "no refuels"
      return { err, car, refuels }
    },
    { key: () => ({ params, searchParams }) }
  )
}

export default function CarPage() {
  const carData = useRouteData<typeof routeData>()
  const [searchParams, setSearchParams] = useSearchParams<SearchParamsType>()

  const [adding, setAdding] = createSignal(false)
  const [newDate, setDate] = createSignal(new Date())
  const [newGallons, setGallons] = createSignal(0)
  const [newPrice, setPrice] = createSignal(0)
  const [newMilesDriven, setMilesDriven] = createSignal(0)

  const [filterType, setFilterType] = createSignal<FilterType>(FilterType.ALL)
  const [customDateEnd, setCustomDateEnd] = createSignal(new Date())
  const [customDateStart, setCustomDateStart] = createSignal(
    // eslint-disable-next-line solid/reactivity
    new Date(new Date().setMonth(customDateEnd().getMonth() - 1))
  )

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
    console.log("ayo", new Date(), newDate().toISOString())
    await addNew({
      carId: carData()?.car.id ?? "",
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

  if (carData() && (carData()?.err || !carData()?.car || !carData()?.refuels)) {
    toast.error("Could not load car and car refuel info 😭")
  }

  createEffect(() => {
    // don't refetch if no change
    // TODO fine grain to check if no change in custom date range
    if (
      searchParams.filterType === filterType() &&
      searchParams.filterType !== FilterType.CUSTOM
    )
      return
    setSearchParams({
      filterType: filterType(),
      startDate:
        filterType() === FilterType.CUSTOM
          ? customDateStart().toISOString()
          : undefined,
      endDate:
        filterType() === FilterType.CUSTOM
          ? customDateEnd().toISOString()
          : undefined,
    })
    refetchRouteData()
  })

  return (
    <Protected>
      <main class="p-14 text-gray-700">
        <div class="flex flex-row items-center justify-between">
          <div>
            <h1 class="text-5xl font-light">{carData()?.car?.name}</h1>
            <h3 class="mt-3 text-xl font-light">
              {carData()?.car?.description}
            </h3>
          </div>
          <button
            class="block rounded bg-sky-600 px-3 py-2 text-white transition hover:bg-sky-400"
            onClick={() => (setAdding(true), clearInputs())}
          >
            Add Refuel Info
          </button>
        </div>
        <div class="mt-6">
          <div class="flex flex-row items-center">
            <h3 class="ml-auto mr-2">Filter Date:</h3>
            <select class="rounded p-1 pl-3 text-sm">
              <option onClick={() => setFilterType(FilterType.ALL)}>All</option>
              <option onClick={() => setFilterType(FilterType.ONE_MONTH)}>
                1 Month
              </option>
              <option onClick={() => setFilterType(FilterType.ONE_YEAR)}>
                1 Year
              </option>
              <option onClick={() => setFilterType(FilterType.CUSTOM)}>
                Custom
              </option>
            </select>
            <Show when={filterType() === FilterType.CUSTOM}>
              <div class="ml-3 flex flex-row items-center">
                <input
                  type="date"
                  class="block rounded border border-slate-400 p-1 text-sm font-light disabled:bg-slate-100 disabled:hover:cursor-not-allowed"
                  value={customDateStart()
                    .toLocaleDateString("en-ZA")
                    .replaceAll("/", "-")}
                  onChange={(e) => {
                    setCustomDateStart(
                      new Date(e.target.value.replaceAll("-", "/")) ??
                        new Date()
                    )
                  }}
                  disabled={addStatus.pending}
                />
                <span class="mx-2">-</span>
                <input
                  type="date"
                  class="block rounded border border-slate-400 p-1 text-sm font-light disabled:bg-slate-100 disabled:hover:cursor-not-allowed"
                  value={customDateEnd()
                    .toLocaleDateString("en-ZA")
                    .replaceAll("/", "-")}
                  onChange={(e) => {
                    setCustomDateEnd(
                      new Date(e.target.value.replaceAll("-", "/")) ??
                        new Date()
                    )
                  }}
                  disabled={addStatus.pending}
                />
              </div>
            </Show>
          </div>
          <table class="mt-2 w-full">
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
                <th class="w-10 bg-slate-300" />
              </tr>
            </thead>
            <For each={carData()?.refuels}>
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
                      {`${new Date(date).getUTCMonth() + 1}/${new Date(
                        date
                      ).getUTCDate()}/${new Date(date).getUTCFullYear()}`}
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
          <Show when={carData()?.refuels.length === 0}>
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
                  value={(() => {
                    const x = newDate()
                      .toLocaleDateString("en-ZA")
                      .replaceAll("/", "-")
                    console.log("yooo", x)
                    return x
                  })()}
                  onChange={(e) => {
                    setDate(
                      new Date(e.target.value.replaceAll("-", "/")) ??
                        new Date()
                    )
                    console.log(
                      "got",
                      e.target.value,
                      newDate(),
                      newDate().toISOString()
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
