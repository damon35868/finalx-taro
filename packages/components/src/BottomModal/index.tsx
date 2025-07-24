import { View } from "@tarojs/components";
import classNames from "classnames";
import React, { CSSProperties, FC, ReactNode } from "react";
import "./index.scss";

interface BottomModalProps {
  status: boolean;
  setStatus?: (state: boolean) => any;
  onClose?: () => any;
  closeOnClickModal?: boolean;
  children: ReactNode;
  rounded?: boolean; //是否开启圆角
  style?: CSSProperties;
  contentStyle?: CSSProperties;
}

export const BottomModal: FC<BottomModalProps> = ({
  status,
  setStatus,
  closeOnClickModal = true,
  onClose,
  style = {},
  contentStyle = {},
  children,
  rounded
}) => {
  const close = () => {
    onClose && onClose();
    setStatus && setStatus(false);
  };

  return (
    <View catchMove className={classNames("fx_bottom-modal", { show: status })} onClick={() => closeOnClickModal && close()} style={style}>
      <View className={classNames("bg fx_bottom-modal-content", { active: status, rounded })} onClick={e => e.stopPropagation()} style={contentStyle}>
        <View className='fx_bottom-modal-content-main'>{children}</View>
      </View>
    </View>
  );
};
