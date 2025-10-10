import { IComponentConfig, IConfig, IMiddlewareConfig, IRequestConfig } from "./types";

class Config implements IConfig {
  public log: boolean = true;
  public middleware: IMiddlewareConfig = {
    userAuth: {},
    roleAuth: {}
  };
  public request: IRequestConfig = {
    timeout: 300000,
    tokenCheck: true,
    wsCheckUser: true
  };

  public component?: IComponentConfig = {
    wrapperOffset: { top: "0rpx", bottom: "120rpx" }
  };
}

export const config: Config = new Config();
