import { log as logHandler } from "../log";
import { ensureHttps } from "../utils";
import { wsClient } from "../ws";
import { config } from "./instance";
import { IComponentConfig, IConfig, IMiddlewareConfig, IRequestConfig } from "./types";
export { config } from "./instance";
export * from "./types";

function requestConfig(reqConfig?: IRequestConfig) {
  if (typeof reqConfig !== "object") return;

  const { host = "", path = "", baseUrl = ensureHttps(host) + path } = reqConfig;
  Object.assign(config, { request: { ...reqConfig, baseUrl } });

  config.log && logHandler.success("[配置请求成功]");
  if (reqConfig.wsUrl) wsClient.init();
}

function middlewareConfig(middleware?: IMiddlewareConfig) {
  if (typeof middleware !== "object") return;

  Object.assign(config, { middleware });
  config.log && logHandler.success("[配置中间件成功]");
}

function componentConfig(component?: IComponentConfig) {
  if (typeof component !== "object") return;

  Object.assign(config, { component });
  config.log && logHandler.success("[配置组件库成功]");
}

export function globalConfig({ request, middleware, component, log }: IConfig) {
  logHandler.success(`[FinalX V${__VERSION__}]`);
  Object.assign(config, { log });
  middlewareConfig(middleware);
  requestConfig(request);
  componentConfig(component);

  Object.freeze(config);
  config.log && logHandler.success("[全局配置完成，已冻结配置文件]", config);

  logHandler.warn("[FinalX 官方文档]", "https://doc.finalx.cc");
  config.log && logHandler.warn("[FinalX 联系作者]", "damonzhang35868@gmail.com");
}
