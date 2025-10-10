import { request } from "@tarojs/taro";
import { config } from "../config";
import { LocalStorageKeys } from "../enums";
import { getItem } from "../utils";

interface requestProps {
  url?: string;
  data?: any;
  method?: any;
  coverUrl?: string;
}

export function apiServer({ url, data, method = "POST", coverUrl }: requestProps): Promise<{
  code: number | string;
  message?: string;
  data: any;
  msg: string | { code: string; message: string };
}> {
  return new Promise((resolve, reject) => {
    request({
      data,
      method,
      timeout: config.request?.timeout,
      url: coverUrl || config.request?.baseUrl + (url || ""),
      header: {
        authorization: getItem(LocalStorageKeys.token) ? (config.request?.bearerToken ? "Bearer " : "") + getItem(LocalStorageKeys.token) : undefined,
        ...(config.request?.header || {})
      },
      success: res => {
        const { statusCode, data } = res;
        const { message } = data || {};
        const { errorRule } = config.request || {};
        const { codeHandler, rejectHandler } = errorRule || {};

        if (codeHandler) {
          const status = codeHandler(statusCode);
          if (!status) return resolve(data);
        } else {
          if (statusCode === 200) return resolve(data);
        }
        reject((rejectHandler ? rejectHandler(res) : message) || "网络错误");
      },
      fail: e => reject(e)
    });
  });
}
