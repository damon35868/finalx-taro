import { Button, View } from "@tarojs/components";
import React, { FC, ReactElement, useRef } from "react";
import { Modal } from "../Modal";
import "./index.scss";

export interface IDialogProps {
  status: boolean;
  content: {
    title: string;
    desc: string | ReactElement;
    btnText: string;
  };
  onCancel?: () => any;
  setStatus: (state: boolean) => any;
  onClose?: () => any;
  onClick?: (close: any) => any;
}

export const Dialog: FC<IDialogProps> = ({ status, setStatus, content, onClick, onCancel }) => {
  const { title, desc, btnText } = content;
  const ref = useRef<{ close: Function }>();

  return (
    <Modal cRef={ref} status={status} setStatus={setStatus} onCancel={onCancel}>
      <View className='fx_dialog'>
        <View className='fx_dialog-title'>{title}</View>
        <View className='fx_dialog-desc'>{desc}</View>
        <Button className='fx_dialog-btn' onClick={() => onClick && onClick(ref.current?.close)}>
          {btnText}
        </Button>
      </View>
    </Modal>
  );
};
