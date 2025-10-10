import { getDeviceInfo, getMenuButtonBoundingClientRect, getWindowInfo, useDidShow, useReachBottom as useOriginReachBottom } from "@tarojs/taro";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { pageSizeStore } from "./pageStore";
import { authStore, initStore, platformStore, systemInfoStateType, systemInfoStore } from "./state";
import { WsEventFunc, wsClient } from "./ws";

/**
 * 页面触底无限滚动
 * @param model useRequest 返回的数据模型
 * @param pageKey 分页页码的 storeKey(在搜索，切换tab场景中需将页码置为1)
 * @param varFn 变量函数
 */
export function useLoadMore(model: any, pageKey: string, varFn?: Function) {
  const { data, run, mutate, loading, params = [{}] } = model || {};
  const { hasNextPage } = data || {};
  pageSizeStore[pageKey] = pageSizeStore[pageKey] === 1 ? 2 : pageSizeStore[pageKey] || 1;

  // 页面或组件销毁时将页码置为1
  useEffect(() => {
    return () => {
      pageSizeStore[pageKey] = 1;
    };
  }, []);

  async function refetchData() {
    if (loading || !hasNextPage) return;
    await run(varFn ? varFn(pageSizeStore[pageKey]) : { ...params[0], page: pageSizeStore[pageKey] });

    mutate((newData: any) => {
      return {
        ...newData,
        items: [...data.items, ...newData.items]
      };
    });
    pageSizeStore[pageKey] += 1;
  }
  useOriginReachBottom(refetchData);

  return { refetchData };
}

/**
 * 页面显示刷新数据（该 hook 不可用到条件渲染的子组件中，比如 if 切换或者 map 渲染）
 * @param model useRequest 返回的对象
 * @param variables 刷新数据的变量
 */
export function useShowFetch(model: any, opt = {}, cb?: () => any) {
  const { refresh } = model;
  useDidShow(() => {
    if (!refresh) return;
    refresh(opt);
    cb && cb();
  });
}

/**
 * @description: 用户系统类型
 * @return {*}
 */
export function useSystem() {
  const system = platformStore(store => store.state);
  const setSystem = platformStore(store => store.setter);
  return {
    system,
    setSystem: (val: string) =>
      unstable_batchedUpdates(() => {
        setSystem(val);
      })
  };
}

/**
 * @description: 系统尺寸存储
 * @return {*}
 */
export function useSystemSize() {
  const size = systemInfoStore(store => store.state);
  const setSystemSize = systemInfoStore(store => store.setter);

  let { windowHeight, screenHeight } = size;
  return {
    ...size,
    customNavHeight: screenHeight - windowHeight,
    setSystemSize: (val: systemInfoStateType) =>
      unstable_batchedUpdates(() => {
        setSystemSize(val);
      })
  };
}

/**
 * @description: 系统尺寸
 * @return {*}
 */
let tryGetDeviceInfoCount = 3;
export function useSystemInfo() {
  const { setSystem } = useSystem();
  const { setSystemSize } = useSystemSize();

  useEffect(() => {
    const { platform } = getDeviceInfo();
    let { statusBarHeight, windowHeight, screenHeight, windowWidth, screenWidth } = getWindowInfo();
    setSystem(platform);
    setSystemSize({ statusBarHeight, windowHeight, screenHeight, windowWidth, screenWidth });

    try {
      const { top, bottom } = getMenuButtonBoundingClientRect();
      if (top === bottom || top === 0 || bottom === 0 || statusBarHeight === 0) {
        tryGetDeviceInfoCount = tryGetDeviceInfoCount - 1;
        if (tryGetDeviceInfoCount < 0) throw new Error();
        return getWindowInfo();
      }
      const paddingTop = top - statusBarHeight;
      windowHeight = screenHeight - bottom - paddingTop;
    } catch (e) {
      windowHeight = screenHeight - 68;
    }

    setSystemSize({
      windowHeight,
      statusBarHeight,
      screenHeight,
      windowWidth,
      screenWidth
    });
  }, []);
}

/**
 * @description: 全局事件注册钩子
 * @param {string} evenName
 * @param {WsEventFunc} eventAction
 * @return {*}
 */
export function useEventListener(evenName: string, eventAction: WsEventFunc) {
  const timer = useRef<any>();
  const fnRef = useRef<WsEventFunc>(eventAction);
  const [isRegistered, setIsRegistered] = useState(false);

  useLayoutEffect(() => {
    fnRef.current = eventAction;
  });

  const eventHandler = (e: any) => {
    fnRef.current(e);
  };

  useEffect(() => {
    if (isRegistered) return timer.current && clearInterval(timer.current);

    timer.current = setInterval(() => {
      if (!wsClient.inited || !fnRef.current) return;

      setIsRegistered(true);
      wsClient.on(evenName, eventHandler);

      timer.current && clearInterval(timer.current);
    }, 100);
  }, []);

  useEffect(
    () => () => {
      wsClient.off(evenName, eventHandler);
    },
    []
  );
}

/**
 * @description: 用户权限弹窗 鉴权失败后弹出
 * @return {*}
 */
export function useUserAuthModal() {
  const userAuthModalStatus = authStore((state: any) => state.state);
  const setUserAuthModalStatus = authStore((state: any) => state.setter);

  return {
    userAuthModalStatus,
    setUserAuthModalStatus: (val: boolean) =>
      unstable_batchedUpdates(() => {
        setUserAuthModalStatus(val);
      })
  };
}

/**
 * @description:  初始化 State
 * @return {*}
 */
export function useUserState() {
  const token = initStore((state: any) => state.token);
  const userInfo = initStore((state: any) => state.userInfo);
  const middlewareData = initStore((state: any) => state.middlewareData);
  const setUserState = initStore((state: any) => state.setter);

  return {
    token,
    userInfo,
    middlewareData,
    setUserState: (val: { token?: string; userInfo?: any; middlewareData?: any }) =>
      unstable_batchedUpdates(() => {
        setUserState(val);
      })
  };
}
