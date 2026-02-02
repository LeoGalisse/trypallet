import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    environment: "node",
    include: ["src/**/*.spec.ts"]
  }
});