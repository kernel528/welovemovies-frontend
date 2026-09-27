import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["kernel528-welovemovies-front-end.onrender.com"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/**/*.test.{js,jsx}"],
      thresholds: {
        branches: 35,
        functions: 25,
        lines: 40,
        statements: 40,
      },
    },
  },
});
