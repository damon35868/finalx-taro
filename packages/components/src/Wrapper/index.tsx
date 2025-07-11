import { config, useSystem, useSystemSize } from "@finalx/common";
import { View } from "@tarojs/components";
import React, { CSSProperties, FC } from "react";
import "./index.scss";

interface WrapperProps {
  space?: boolean;
  bottomSpace?: boolean;
  bgColor?: string;
  style?: CSSProperties;
  children?: any;
  fullScreen?: boolean;
  offset?: { top?: string; bottom?: string };
}

export const Wrapper: FC<WrapperProps> = ({
  space = true,
  fullScreen = true,
  bottomSpace,
  children,
  bgColor,
  style = {},
  offset = { top: config?.component?.wrapperOffset?.top || "0rpx", bottom: config?.component?.wrapperOffset?.bottom || "120rpx" }
}) => {
  const { customNavHeight } = useSystemSize();
  const { top = "0rpx", bottom = "120rpx" } = offset || {};

  const topOffset = `${customNavHeight}PX + ${top}`;
  const bottomOffset = `(env(safe-area-inset-bottom) + ${bottom})`;

  return (
    <View
      style={{
        backgroundColor: bgColor || "",
        paddingTop: space ? `calc(${topOffset})` : "",
        paddingBottom: bottomSpace ? `calc(${bottomOffset})` : "",
        ...(fullScreen ? { minHeight: `calc(100vh - ${space ? topOffset : "0rpx"} - ${bottomSpace ? bottomOffset : "0rpx"})` } : {}),
        ...style
      }}
    >
      {children}
    </View>
  );
};

interface BottomWrapperProps {
  children?: any;
  bgColor?: string;
  height?: string;
  wrapperStyle?: CSSProperties;
  style?: CSSProperties;
}
export const BottomWrapper: FC<BottomWrapperProps> = ({ height = "106rpx", bgColor, wrapperStyle = {}, style = {}, children }) => {
  const { system } = useSystem();
  const isAndroid = system === "android";

  return (
    <View className='bottom-wrapper' style={wrapperStyle}>
      <View
        className='bottom-wrapper-content'
        style={{
          height,
          backgroundColor: bgColor || "",
          paddingBottom: isAndroid ? "calc(env(safe-area-inset-bottom) + 10px)" : "env(safe-area-inset-bottom)",
          ...style
        }}
      >
        {children}
      </View>
    </View>
  );
};
