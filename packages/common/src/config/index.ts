import { log as logHandler } from "../log";
import { wsClient } from "../ws";
import { config } from "./instance";
import { IComponentConfig, IConfig, IMiddlewareConfig, IRequestConfig } from "./types";

export { config } from "./instance";
export * from "./types";

function ensureHttps(url: string) {
  // 正则表达式匹配以 'http://' 或 'https://' 开头的 URL
  const regex = /^(http:\/\/|https:\/\/)/;

  // 如果 URL 没有 'http://' 或 'https://' 前缀，则添加 'https://'
  if (!regex.test(url)) {
    url = "https://" + url;
  }

  return url;
}

function requestConfig(reqConfig?: IRequestConfig) {
  if (typeof reqConfig !== "object") return;

  const { host, path, baseUrl = ensureHttps(host) + path } = reqConfig;
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
  Object.assign(config, { log });
  middlewareConfig(middleware);
  requestConfig(request);
  componentConfig(component);

  Object.freeze(config);
  config.log && logHandler.success("[全局配置完成，已冻结配置文件]", config);
}
