import { config } from "../config";
import { ErrorCode } from "../enums";
import { sleep, toast } from "../utils";

/**
 * @description: 全局帮助类
 * @return {*}
 */
class HttpHelper {
  // 重试次数
  private timeoutCount: number = 0;
  // 重试最大次数
  private maxCount: number = 100;

  /**
   * @description: 统一请求执行，包含错误处理
   * @param {Object} config - 请求配置对象
   * @param {Function} config.apiFn - 需要执行的异步API函数，应返回Promise
   * @param {string} [config.text] - 请求加载时显示的提示文本（可选）
   * @param {string} [config.errorText] - 请求失败时显示的错误提示文本（可选）
   * @param {Function} [config.callback] - 请求成功后的回调函数，接收响应结果作为参数（可选）
   * @param {Function} [config.onError] - 请求失败时的自定义错误处理函数（可选）
   * @param {boolean} [config.showToast=true] - 是否显示错误提示（默认true）
   * @param {Function} [config.rule] - 自定义响应验证规则函数，返回boolean决定是否认为请求成功（可选）
   * @return {Promise<any>}
   */
  async run({
    apiFn,
    text,
    errorText,
    callback,
    showToast = true,
    onError,
    rule
  }: {
    apiFn: () => Promise<any>;
    text?: string;
    errorText?: string;
    callback?: (res: any) => any;
    onError?: (err: any) => any;
    showToast?: boolean;
    rule?: (val?: any) => boolean;
  }): Promise<any> {
    return new Promise(async (resove, reject) => {
      try {
        const res = await apiFn();

        if (rule) {
          if (!rule(res)) throw new Error(res.msg && typeof res.msg === "object" ? res.msg.message : `${text}失败`);
        } else {
          const { code, message } = res || {};
          const { errorRule } = config.request || {};
          const { codeHandler, rejectHandler } = errorRule || {};
          const rejectMessage = (rejectHandler ? rejectHandler(res) : message) || "网络错误";

          if (codeHandler) {
            const status = codeHandler(code);
            if (status) throw new Error(rejectMessage);
          }

          if (code !== 0 && code !== 200) throw new Error(rejectMessage);
          if (code === ErrorCode.error) throw new Error(rejectMessage);
          if (code === ErrorCode.server) {
            let message = "";
            if (res.msg) {
              typeof res.msg === "object" && (message = res.msg.message);
              if (typeof res.msg === "string") {
                try {
                  message = JSON.parse(res.msg).message;
                } catch (e) {
                  message = "网络错误";
                }
              }
            }

            throw new Error(message || rejectMessage);
          }
        }

        resove(res);
        callback && callback(res);
        showToast && text && toast(`${text}成功`);
      } catch (e: any) {
        reject(e);
        onError && onError(e);
        showToast && toast(errorText || (e?.message ? e?.message : e));
      }
    });
  }

  /**
   * @description: 接口重试方法 [支持自定义重试规则、延迟和最大重试次数]
   * @param {Object} config - 重试配置对象
   * @param {number} [config.delay=0] - 重试间隔时间（毫秒），默认0（立即重试）
   * @param {number} [config.maxCount=this.maxCount] - 最大重试次数，默认使用实例的maxCount
   * @param {Function} config.callback - 需要重试的异步回调函数，应返回Promise
   * @param {Function} [config.rule] - 自定义重试条件函数，返回boolean决定是否需要重试（可选）
   * @return {Promise<any>}
   */
  retry({
    rule,
    callback,
    delay = 0,
    maxCount = this.maxCount
  }: {
    delay?: number;
    maxCount?: number;
    callback: (val?: any) => Promise<any>;
    rule?: (val?: any) => boolean;
  }): Promise<any> {
    this.timeoutCount = 0;
    return new Promise(async (resove, reject) => {
      do {
        try {
          const data = await this.run({
            showToast: false,
            apiFn: () => callback()
          });

          const status = rule ? rule(data) : true;
          if (!status) throw new Error("返回值不符合要求");

          this.abortRetry(maxCount);
          resove({ msg: "重试成功", data });
        } catch (e) {
          this.timeoutCount++;
          console.log(`[--重试第${this.timeoutCount}次--]`);

          await sleep(delay);
          if (this.timeoutCount >= maxCount) reject(new Error("重试次数达到上限"));
        }
      } while (this.timeoutCount <= maxCount);
    });
  }

  /**
   * @description: 终止重试函数
   * @param {*} maxCount 当前最大重试次数
   * @return {*}
   */
  abortRetry(maxCount = this.maxCount) {
    this.timeoutCount = maxCount + 1;
  }
}

export const httpHelper = new HttpHelper();
