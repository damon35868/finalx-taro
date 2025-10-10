import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
      name: "finalx-common-esm"
    },
    plugins: [external(), commonjs(), typescript({ tsconfig: "./tsconfig.json" }), terser()],
    external: ["react", "react-dom", "@tarojs/taro", "@tarojs/components"]
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true
    },
    plugins: [external(), resolve(), commonjs(), typescript({ tsconfig: "./tsconfig.json" }), terser()],
    external: ["react", "react-dom", "@tarojs/taro", "@tarojs/components"]
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()]
  }
];
