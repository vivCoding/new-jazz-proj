import solid from "solid-start/vite"
import { defineConfig } from "vite"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vercel from "solid-start-vercel"

export default defineConfig({
  plugins: [
    solid({
      adapter: vercel({ edge: false }),
    }),
  ],
  ssr: {
    external: ["@auth/typeorm-adapter"],
  },
})
