import { log as logHandler } from "../log";
import { ensureHttps } from "../utils";
import { wsClient } from "../ws";
import { config } from "./instance";
import { IComponentConfig, IConfig, IMiddlewareConfig, IRequestConfig } from "./types";
export { config } from "./instance";
export * from "./types";

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

export const VERSION = pkg.version;

function logCheck(action: string | (() => any), data?: any) {
  if (!config?.log) return;

  if (typeof action === "function") return action();
  if (typeof action === "string") return logHandler.success(action, data);
}

function requestConfig(reqConfig?: IRequestConfig) {
  if (typeof reqConfig !== "object") return;

  const { host = "", path = "", baseUrl = ensureHttps(host) + path } = reqConfig;
  Object.assign(config, { request: { ...config?.request, ...reqConfig, baseUrl } });

  logCheck("[配置请求成功]");
  if (reqConfig.wsUrl) wsClient.init();
}

function middlewareConfig(middleware?: IMiddlewareConfig) {
  if (typeof middleware !== "object") return;

  Object.assign(config, { middleware: { ...config?.middleware, ...middleware } });
  logCheck("[配置中间件成功]");
}

function componentConfig(component?: IComponentConfig) {
  if (typeof component !== "object") return;

  Object.assign(config, { component: { ...config?.component, ...component } });
  logCheck("[配置组件库成功]");
}

export function globalConfig({ request, middleware, component, log }: IConfig) {
  Object.assign(config, { log: typeof log === "boolean" ? log : config?.log });
  logCheck(() => logHandler.warn(`[FinalX V${VERSION}]`));
  middlewareConfig(middleware);
  requestConfig(request);
  componentConfig(component);

  Object.freeze(config);
  logCheck("[全局配置完成，已冻结配置文件]", config);
  logCheck(() => logHandler.warn("[FinalX 官方文档]", "https://doc.finalx.cc"));
  logCheck(() => logHandler.warn("[FinalX Issues]", "https://github.com/damon35868/finalx-taro/issues"));
}
