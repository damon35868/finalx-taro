import { TFilterKey } from "@finalx/common";
import { BaseAuth } from "./base.auth";

/**
 * @description: 角色权限
 * @return {*}
 */
class RoleAuth extends BaseAuth {
  private permission = {
    view: true,
    edit: true,
    delete: true,
    create: true
  };

  private checkKey(key: string): boolean {
    const keys = Object.keys(this.permission);
    if (!keys.includes(key)) throw new Error("传入了非法权限");
    return true;
  }

  public check(cb?: Function, errcb?: Function, filterKey?: TFilterKey): boolean {
    return false;
  }

  public getPermission(filterKey: TFilterKey, config?: any): boolean {
    if (Array.isArray(filterKey)) {
      const keys = filterKey.map(item => {
        if (typeof item === "string") {
          this.checkKey(item);
        } else {
          this.checkKey(item.key);
        }
      });
    } else {
      this.checkKey(filterKey);
    }

    return false;
  }
}

export const roleAuth = new RoleAuth();
