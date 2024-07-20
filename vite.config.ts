import { coverageConfigDefaults, defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import viteTsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  base: "/atkit/",
  plugins: [react(), viteTsconfigPaths()],
  server: {
    open: true,
    port: 3000,
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      include: ["src/**"],
      exclude: [
        "src/index.tsx",
        "src/devtools/**",
        "src/data/api/mocks/**",
        ...coverageConfigDefaults.exclude
      ],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
  build: {
    outDir: "build",
  },
});
