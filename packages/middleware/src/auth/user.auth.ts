import { config, getItem, getMiddlewareData, setUserAuth, TFilterKey } from "@finalx/common";
import { LocalStorageKeys } from "../enums";
import { BaseAuth } from "./base.auth";

class UserAuth extends BaseAuth {
  private get userInfo() {
    return getItem(LocalStorageKeys.userInfo);
  }

  private get filterKey() {
    return config?.middleware?.userAuth?.filterKey || ["name", "mobilePhone"];
  }

  private get filterData() {
    const dataSource = config.middleware?.userAuth.data || this.userInfo;
    if (typeof dataSource === "string") return getMiddlewareData(dataSource) || getItem(dataSource) || {};

    return dataSource;
  }

  /**
   * @description: 查看授权
   * @return {*}
   */
  public check(cb?: Function, errcb?: Function, filterKey?: TFilterKey): boolean {
    cb && this.setLastCb(cb);
    const key = filterKey || this.filterKey;
    const hasAuth = this.getPermission(key);

    setUserAuth(!hasAuth);

    if (hasAuth) {
      if (this.lastCb) {
        this.lastCb();
        return true;
      }

      cb && cb();
      return true;
    }

    errcb && errcb();
    return false;
  }

  public getPermission(filterKey: TFilterKey, config?: any): boolean {
    if (!filterKey) throw new Error("传入了非法权限筛选键");
    const dataSource = config || this.filterData;

    if (Array.isArray(filterKey)) {
      const filters = filterKey.map(item => {
        if (typeof item === "string") return !!dataSource[item];
        if (item.rule) return item.rule(dataSource, item.key);
        return !!dataSource[item.key];
      });

      return filters.every(authStatus => authStatus);
    }

    return !!dataSource[filterKey];
  }
}

export const userAuth = new UserAuth();
