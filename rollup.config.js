import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default [
  // Main bundle
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "./dist",
      }),
      terser(),
    ],
    external: ["nehonix-uri-processor"],
  },
  // Core modules
  {
    input: "src/core/generator.ts",
    output: [
      { file: "dist/core/generator.js", format: "cjs", sourcemap: true },
      { file: "dist/core/generator.esm.js", format: "esm", sourcemap: true },
    ],
    plugins: [nodeResolve(), commonjs(), typescript(), terser()],
    external: ["nehonix-uri-processor", "../types", "./encoder"],
  },
  {
    input: "src/core/encoder.ts",
    output: [
      { file: "dist/core/encoder.js", format: "cjs", sourcemap: true },
      { file: "dist/core/encoder.esm.js", format: "esm", sourcemap: true },
    ],
    plugins: [nodeResolve(), commonjs(), typescript(), terser()],
    external: ["nehonix-uri-processor"],
  },
  {
    input: "src/core/validator.ts",
    output: [
      { file: "dist/core/validator.js", format: "cjs", sourcemap: true },
      { file: "dist/core/validator.esm.js", format: "esm", sourcemap: true },
    ],
    plugins: [nodeResolve(), commonjs(), typescript(), terser()],
    external: ["nehonix-uri-processor", "../types"],
  },
  // Types
  {
    input: "src/types/index.ts",
    output: [
      { file: "dist/types/index.js", format: "cjs", sourcemap: true },
      { file: "dist/types/index.esm.js", format: "esm", sourcemap: true },
    ],
    plugins: [nodeResolve(), commonjs(), typescript(), terser()],
    external: ["../core/encoder"],
  },
  {
      input: "src/index.ts",
      output: {
        file: "dist/index.d.ts",
        format: "es",
      },
      plugins: [dts()],
    },
];
