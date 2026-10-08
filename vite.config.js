import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    css: false,
    env: { VITE_API_URL: "http://localhost:8080/api" },
    include: ["src/**/*.{spec,test}.{js,jsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/**/*.{spec,test}.{js,jsx}", "src/test/**", "src/setupTests.js", "src/main.jsx"],
      reporter: ["text-summary", "html", "lcov"],
    },
  },
});
