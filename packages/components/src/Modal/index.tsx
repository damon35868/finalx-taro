import { View } from "@tarojs/components";
import classNames from "classnames";
import React, { CSSProperties, FC, ReactElement, useEffect, useImperativeHandle, useState } from "react";
import "./index.scss";

export interface IModalProps {
  status: boolean;
  setStatus: Function;
  onClose?: () => any;
  onCancel?: () => any;
  closeOnClickModal?: boolean;
  cRef?: any;
  hideBG?: boolean;
  arg?: any;
  children: ReactElement;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
}

export const Modal: FC<IModalProps> = ({
  status,
  setStatus,
  closeOnClickModal = true,
  onClose,
  onCancel,
  children,
  cRef,
  hideBG,
  arg,
  style = {},
  contentStyle = {}
}) => {
  const [contentStatus, setContentStatus] = useState(false);

  useEffect(() => setContentStatus(status), [status]);
  const close = () => {
    setContentStatus(false);
    setTimeout(() => {
      setStatus(arg || false);
      onClose && onClose();
    }, 150);
  };

  useImperativeHandle(cRef, () => ({ close }));

  return (
    <View
      catchMove
      className={classNames("fx_modal", {
        show: status,
        bg: !hideBG
      })}
      onClick={() => {
        if (!closeOnClickModal) return;
        close();
        onClose && onClose();
        onCancel && onCancel();
      }}
      style={style}
    >
      <View onClick={e => e.stopPropagation()} className={classNames(`fx_modal-scale-${contentStatus ? "in" : "out"}`)} style={contentStyle}>
        {children}
      </View>
    </View>
  );
};
