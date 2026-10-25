import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    // 게임 화면 + 관리자 페이지(/admin/) + 도트 편집(/pixel/)
    rollupOptions: {
      input: {
        main: new URL("./index.html", import.meta.url).pathname,
        admin: new URL("./admin/index.html", import.meta.url).pathname,
        pixel: new URL("./pixel/index.html", import.meta.url).pathname,
      },
    },
  },
});
