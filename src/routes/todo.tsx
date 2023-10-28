import { For, createMemo, createSignal } from "solid-js"

export default function Nice() {
  const [newItem, setNewItem] = createSignal("")
  const [currId, setCurrId] = createSignal(0)
  const [items, setItems] = createSignal<
    { id: number; isDone: boolean; item: string }[]
  >([])

  const numItemsDone = createMemo(
    () => items().filter((it) => it.isDone).length
  )
  const addNewItem = () => {
    if (newItem() !== "") {
      setItems((prev) => [
        ...prev,
        { id: currId(), isDone: false, item: newItem() },
      ])
      setNewItem("")
      setCurrId(currId() + 1)
    }
  }

  return (
    <main class="p-4">
      <h1 class="text-3xl font-semibold">Todo list</h1>
      <div class="mt-2">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            class="rounded border border-slate-400 p-1 text-sm font-light"
            value={newItem()}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button
            type="submit"
            class="ml-2 rounded bg-blue-200 px-3 py-1 transition hover:bg-blue-300"
            onClick={addNewItem}
          >
            Add
          </button>
        </form>
      </div>
      <h3 class="mt-2 text-xl">
        <b>Tasks done: </b>
        <span class="font-light">
          {numItemsDone()}/{items().length}
        </span>
      </h3>
      <div class="mt-2">
        <For each={items()}>
          {(item) => (
            <div
              onClick={() =>
                setItems((prev) =>
                  prev.map((it) =>
                    it.id === item.id ? { ...it, isDone: !it.isDone } : it
                  )
                )
              }
            >
              <input type="checkbox" checked={item.isDone} />
              <label class="ml-1">{item.item}</label>
            </div>
          )}
        </For>
      </div>
    </main>
  )
}
