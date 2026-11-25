import react from "@vitejs/plugin-react";
import { msw } from "msw/vite";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  base: "/atkit/",
  plugins: [
    msw(),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    open: true,
    port: 3000,
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/index.tsx",
        "src/assets/js/**",
        "src/devtools/**",
        "src/data/api/mocks/**",
        "**/types.ts",
        ...coverageConfigDefaults.exclude
      ],
      thresholds: {
        'src/**/!(hooks|jsonUtils).{ts,tsx}': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        // TODO: add tests
        'src/data/hooks.ts': {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0,
        },
        // TODO: add tests
        'src/data/jsonUtils.ts': {
          branches: 0,
          functions: 0,
          lines: 20,
          statements: 20,
        },
      },
    },
  },
  build: {
    outDir: "build",
  },
});
