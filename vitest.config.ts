import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "@abroadmate/database": path.resolve(__dirname, "packages/database/src"),
      "@abroadmate/shared": path.resolve(__dirname, "packages/shared/src"),
      "@abroadmate/validation": path.resolve(__dirname, "packages/validation/src"),
      "@abroadmate/eligibility-engine": path.resolve(__dirname, "packages/eligibility-engine/src"),
      "@abroadmate/scholarship-engine": path.resolve(__dirname, "packages/scholarship-engine/src"),
      "@abroadmate/visa-engine": path.resolve(__dirname, "packages/visa-engine/src"),
      "@abroadmate/roadmap-engine": path.resolve(__dirname, "packages/roadmap-engine/src"),
      "@abroadmate/ai": path.resolve(__dirname, "packages/ai/src"),
    },
  },
});
