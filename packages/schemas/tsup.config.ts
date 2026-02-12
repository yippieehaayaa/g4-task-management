import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/iam/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: process.env.NODE_ENV !== "production",
  clean: true,
  minify: process.env.NODE_ENV === "production",
  treeshake: {
    preset: "recommended",
  },
  outDir: "dist",
  target: "es2020",
  platform: "node",
  skipNodeModulesBundle: true,
  metafile: true,
  external: ["zod"],
});
