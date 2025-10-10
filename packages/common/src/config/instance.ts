import { IComponentConfig, IConfig, IMiddlewareConfig, IRequestConfig } from "./types";

class Config implements IConfig {
  public log: boolean = true;
  public middleware: IMiddlewareConfig = {
    userAuth: {},
    roleAuth: {}
  };
  public request: IRequestConfig = {
    host: "",
    path: "",
    wsUrl: "",
    baseUrl: "",
    timeout: 300000,
    tokenCheck: true,
    wsCheckUser: true,
    wsPing: true,
    wsAck: true,
    wsEventKey: {
      eventKey: "EventName",
      dataKey: "Data"
    }
  };

  public component?: IComponentConfig = {
    wrapperOffset: { top: "0rpx", bottom: "120rpx" },
    noContentImage: "",
    navBarBackIcon: { el: null, lightIcon: "", darkIcon: "" },
    map: { key: "" }
  };
}

export const config: Config = new Config();
