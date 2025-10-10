import { View } from "@tarojs/components";
import classNames from "classnames";
import React, { FC, ReactNode } from "react";
import "./index.scss";

export interface IFlipProps {
  front: ReactNode;
  back: ReactNode;
  model: [boolean, Function];
  props?: any;
}
export const Flip: FC<IFlipProps> = ({ front, back, model, ...props }) => {
  const [reverse, setReverse]: [boolean, Function] = model;

  return (
    <View {...props} className={classNames("card-filp", { reverse })} onClick={() => back && setReverse(!reverse)}>
      <View className='back'>{back}</View>
      <View className='front'>{front}</View>
    </View>
  );
};
