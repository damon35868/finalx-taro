import { config } from "@finalx/common";
import { Image, View } from "@tarojs/components";
import React, { CSSProperties, FC } from "react";
import "./index.scss";

export interface INoContentProps {
  model: any;
  text?: string;
  style?: CSSProperties;
  lineStyle?: CSSProperties;
  textStyle?: CSSProperties;
  color?: string;
  textColor?: string;
}

export const NoContent: FC<INoContentProps> = ({ model, text, textColor = "", color = "", style = {}, lineStyle = {}, textStyle = {} }) => {
  const { data } = model || {};
  const { hasNextPage = true } = data || {};

  if (hasNextPage) return null;

  return (
    <View className='no-content' style={style}>
      <View className='no-content-line' style={{ backgroundColor: color, ...lineStyle }} />
      <View className='no-content-text' style={{ color: textColor, ...textStyle }}>
        {text || "没有更多了"}
      </View>
      <View className='no-content-line' style={{ backgroundColor: color, ...lineStyle }} />
    </View>
  );
};

export interface INoContentRectProps {
  model: any;
  text?: string;
  src?: string;
  style?: CSSProperties;
  textStyle?: CSSProperties;
  imgStyle?: CSSProperties;
  children?: any;
}
export const NoContentRect: FC<INoContentRectProps> = ({
  model,
  text,
  src = config?.component?.noContentImage || "",
  style,
  textStyle,
  imgStyle,
  children
}) => {
  const { data } = model;
  const { totalCount = 1 } = data || {};
  if (totalCount) return null;

  return (
    <View className='no-content-rect' style={style}>
      {children ? children : <Image className='no-content-rect-img' w-448 h-448 src={src} style={imgStyle} />}
      {text && (
        <View className='no-content-rect-text' style={textStyle}>
          {text}
        </View>
      )}
    </View>
  );
};
