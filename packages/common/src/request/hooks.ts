import { request } from "@tarojs/taro";
import { useRequest as useQuery } from "taro-hooks";
import { BaseOptions, BaseResult, LoadMoreOptions, PaginatedOptionsWithFormat } from "taro-hooks/dist/useRequest/types";
import { config } from "../config";
import { LocalStorageKeys } from "../enums";
import { useUserState } from "../hooks";
import { getItem } from "../utils";

export interface requestOptions {
  url?: string;
  coverUrl?: string;
  coverOption?: boolean;
  method?: string;
  data?: any;
  token?: string;
}

const asyncFn = ({ url, data, method, token }: { url: string; data: any; method: any; token?: string }) => {
  return new Promise((resolve, reject) => {
    request({
      url,
      data,
      method,
      timeout: config.request?.timeout,
      header: {
        authorization:
          token || getItem(LocalStorageKeys.token)
            ? (config.request?.bearerToken ? "Bearer " : "") + (token || getItem(LocalStorageKeys.token))
            : undefined,
        ...(config.request?.header || {})
      }
    })
      .then(res => {
        const { statusCode, data } = res;
        const { message } = data || {};
        const resp = res.data.hasOwnProperty("data") ? res.data.data : res.data;

        const { errorRule } = config.request || {};
        const { codeHandler, rejectHandler } = errorRule || {};

        if (codeHandler) {
          if (!codeHandler(statusCode)) return resolve(resp);
        } else {
          if (statusCode === 200) return resolve(resp);
        }
        reject((rejectHandler ? rejectHandler(res) : message) || "网络错误");
      })
      .catch(e => reject(e));
  });
};

export const useRequest = (
  { url, data, method = "POST", coverUrl, coverOption }: requestOptions,
  options?: PaginatedOptionsWithFormat<any, any, any> | BaseOptions<any, any> | LoadMoreOptions<any>
): BaseResult<any, any> => {
  const { token: reqToken } = useUserState();

  return useQuery(
    (payload: any, option?: { httpUrl: string; token?: string }) => {
      const { httpUrl, token } = option || {};
      return asyncFn({
        token,
        method,
        data: {
          ...data,
          ...payload
        },
        url: httpUrl || coverUrl || String(config.request?.baseUrl) + url
      });
    },
    coverOption
      ? options || {}
      : {
          ...(options as any),
          ready:
            !!config.request?.baseUrl &&
            (config?.request?.tokenCheck ? !!reqToken : true) &&
            ((options || {}).hasOwnProperty("ready") ? options.ready : true)
        }
  );
};
