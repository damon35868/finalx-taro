import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { createRequire } from "node:module";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
const require = createRequire(import.meta.url);
const pkg = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
      name: "finalx-common-esm"
    },
    plugins: [
      replace({
        values: {
          __VERSION__: JSON.stringify(pkg.version)
        },
        preventAssignment: true
      }),
      external(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser()
    ],
    external: ["react", "react-dom", "@tarojs/taro", "@tarojs/components"]
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true
    },
    plugins: [
      replace({
        values: {
          __VERSION__: JSON.stringify(pkg.version)
        },
        preventAssignment: true
      }),
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser()
    ],
    external: ["react", "react-dom", "@tarojs/taro", "@tarojs/components"]
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()]
  }
];
