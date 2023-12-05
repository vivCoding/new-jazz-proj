import { A } from "solid-start"

export default function About() {
  return (
    <main class="mx-auto p-4 text-center text-gray-700">
      <h1 class="max-6-xs mt-16 text-6xl font-light text-sky-700">About</h1>
      <div class="mt-8">
        <p>cs348 proj</p>
        <p>yea bro it's pretty cool</p>
        <A
          href="https://github.com/vivCoding/new-jazz-proj"
          class="text-sky-600 hover:underline"
        >
          GitHub
        </A>
      </div>
    </main>
  )
}
