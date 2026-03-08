import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.js", "src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/utils/**", "src/content/grants/**"],
    },
  },
});
