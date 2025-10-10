import { View } from "@tarojs/components";
import React, { CSSProperties, FC, ReactElement, isValidElement } from "react";
import "./index.scss";

export interface IStepProps {
  proportion?: number | string;
  activeColor?: string;
  slotColor?: string;
  pop?: {
    title?: string;
    style?: CSSProperties;
    onClick?: () => any;
    offset?: { left?: number; right?: number };
    children?: ReactElement;
  };
  content?: {
    titleStyle?: CSSProperties;
    descStyle?: CSSProperties;
  };
  round?: ReactElement;
  items: { title?: string; desc?: string; process?: number }[];
}
export const Step: FC<IStepProps> = ({ proportion, items = [], pop, content, round, activeColor, slotColor }) => {
  const { title, style, offset, children: popChildren, onClick } = pop || {};

  function getPopAliginStyle() {
    const { left = 0, right = 0 } = offset || {};

    return Number(proportion) >= (right || 80)
      ? "step-groove-active-pop-right"
      : Number(proportion) <= (left || 15)
      ? "step-groove-active-pop-left"
      : "";
  }

  const { titleStyle, descStyle } = content || {};

  return (
    <View className='step' style={{ paddingTop: pop ? "102rpx" : "30rpx" }}>
      <View className='step-content'>
        <View className='step-warpper'>
          {items.map((item, key) => {
            const { title, desc, process = 0 } = item;
            const active = Number(proportion) >= process;

            return (
              <View
                key={key}
                className={`step-round ${"step-round-" + (key + 1)} ${active ? "active" : ""}`}
                style={{
                  left: `calc(${process + "%"} - 40rpx)`,
                  borderColor: active ? activeColor : slotColor,
                  backgroundColor: active ? activeColor : slotColor
                }}
              >
                {!!(active && round) && round}
                <View className='step-round-content'>
                  <View className='step-round-content-title' style={titleStyle}>
                    {title}
                  </View>
                  <View className='step-round-content-desc' style={descStyle}>
                    {desc}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View className='step-groove'>
          <View className='step-groove-pipeline' style={{ backgroundColor: slotColor }} />
          <View
            className='step-groove-active'
            style={{
              backgroundColor: activeColor,
              width: `${Number(proportion) >= 100 ? 100 : Number(proportion)}%`
            }}
          >
            {pop && (
              <View className={`step-groove-active-pop ${getPopAliginStyle()}`} onClick={onClick}>
                <View className='step-groove-active-pop-title' style={style}>
                  {isValidElement(popChildren) ? popChildren : title}
                </View>
                <View className='step-groove-active-pop-rect' style={style} />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
