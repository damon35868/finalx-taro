import { ReactElement } from "react";
export interface IConfig {
  log?: boolean;
  component?: IComponentConfig;
  request?: IRequestConfig;
  middleware?: IMiddlewareConfig;
}

export interface IRequestConfig {
  host?: string;
  path?: string;
  baseUrl?: string;
  header?: any;
  timeout?: number;
  bearerToken?: boolean;
  wsUrl?: string;
  wsPing?: boolean;
  wsAck?: boolean;
  wsCheckUser?: boolean;
  wsHeader?: any;
  wsEventKey?: {
    eventKey?: string;
    dataKey?: string;
  };
  wsOnInitSuccess?: (res?: any) => any;
  wsOnInitFail?: (res?: any) => any;
  wsOnReConnect?: () => any;
  wsOnError?: () => any;
  wsOnClose?: () => any;
  errorRule?: {
    codeHandler?: (code: number) => boolean;
    rejectHandler?: (res: any) => string;
  };
}

export type TFilterKey = string | ({ key: string; rule?: (val: any, key: string) => boolean } | string)[];

export interface IMiddlewareConfig {
  userAuth?: {
    data?: Object | string;
    filterKey?: TFilterKey;
  };

  roleAuth?: {
    data?: Object | string;
    filterKey?: TFilterKey;
  };
}

export interface IComponentConfig {
  wrapperOffset?: {
    top?: string;
    bottom?: string;
  };
  noContentImage?: string;
  navBarBackIcon?: {
    el?: ReactElement;
    lightIcon?: string;
    darkIcon?: string;
  };
}
