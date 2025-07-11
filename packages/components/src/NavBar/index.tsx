import { config, routerBack, useSystemSize } from "@finalx/common";
import { Image, Text, View } from "@tarojs/components";
import { usePageScroll } from "@tarojs/taro";
import classNames from "classnames";
import React, { CSSProperties, FC, ReactElement, isValidElement, memo, useState } from "react";
import "./index.scss";

interface NavBarProps {
  title?: string | null | ReactElement;
  style?: CSSProperties;
  icon?: ReactElement | { lightIcon?: string; darkIcon?: string };
  scrollShow?: boolean;
  onBack?: () => any;
  showBack?: boolean;
  theme?: "dark" | "light";
  scrollStyle?: CSSProperties;
  onScrollShow?: (scrollShowStatus: boolean) => void;
}

export const NavBar: FC<NavBarProps> = memo(
  ({ title = "", scrollShow, onBack, showBack = true, icon, theme = "dark", style = {}, scrollStyle, onScrollShow }) => {
    const [top, setTop] = useState(0);
    const isScroll = top >= 110;
    const { customNavHeight, statusBarHeight } = useSystemSize();

    usePageScroll(({ scrollTop }) => {
      setTop(scrollTop);
      onScrollShow && onScrollShow(isScroll);
    });

    return (
      <View
        style={{
          height: customNavHeight + "PX",
          paddingTop: statusBarHeight + "PX",
          color: theme === "dark" ? "#333" : "#fff",
          ...style,
          ...(isScroll ? (scrollStyle ? scrollStyle : {}) : {})
        }}
        className={classNames("fx_nav-bar", { bg: isScroll && !scrollStyle })}
      >
        <View className='fx_nav-bar-content' style={{ height: customNavHeight - statusBarHeight + "PX" }}>
          {showBack && (
            <View
              className='fx_nav-bar-back-parent'
              onClick={() => {
                if (onBack) return onBack();
                routerBack();
              }}
            >
              {icon ? (
                isValidElement(icon) ? (
                  icon
                ) : (
                  <Image
                    className='fx_nav-bar-back-icon'
                    src={
                      theme === "dark" || isScroll
                        ? icon?.darkIcon || config?.component?.navBarBackIcon?.darkIcon
                        : icon?.lightIcon || config?.component?.navBarBackIcon?.lightIcon
                    }
                  />
                )
              ) : isValidElement(config?.component?.navBarBackIcon?.el) ? (
                config?.component?.navBarBackIcon?.el
              ) : (
                <View
                  className='fx-iconfont icon-icon-left'
                  style={{
                    fontWeight: 600,
                    fontSize: "36rpx",
                    marginLeft: "14rpx",
                    color:
                      theme === "dark" || isScroll
                        ? (style || ({} as CSSProperties))?.color || "#333"
                        : (scrollStyle || ({} as CSSProperties))?.color || "#fff"
                  }}
                />
              )}
            </View>
          )}

          {(isScroll || !scrollShow) && (isValidElement(title) ? title : <Text className='fx_nav-bar-title'>{title}</Text>)}
        </View>
      </View>
    );
  }
);
