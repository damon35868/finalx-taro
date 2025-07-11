import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
      name: "finalx-components"
    },
    plugins: [
      external(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      copy({
        targets: [
          { src: "src/**/*.ttf", dest: "dist/" },
          { src: "src/**/*.woff", dest: "dist/" },
          { src: "src/**/*.woff2", dest: "dist/" }
        ]
      }),
      postcss({
        inject: true,
        minimize: true,
        extract: "style.css"
      }),
      terser(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"]
      })
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
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      copy({
        targets: [
          { src: "src/**/*.ttf", dest: "dist/" },
          { src: "src/**/*.woff", dest: "dist/" },
          { src: "src/**/*.woff2", dest: "dist/" }
        ]
      }),
      postcss({
        inject: true,
        minimize: true,
        extract: "style.css"
      }),
      terser(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"]
      })
    ],
    external: ["react", "react-dom", "@tarojs/taro", "@tarojs/components"]
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [/\.scss$/],
    plugins: [dts()]
  }
];
