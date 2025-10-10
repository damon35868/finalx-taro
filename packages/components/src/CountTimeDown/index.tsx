import { View } from "@tarojs/components";
import React, { FC, ReactElement, useEffect, useRef, useState } from "react";

export interface ITimeType {
  day: number | string;
  hour: number | string;
  minute: number | string;
  second: number | string;
}
export interface ICountTimeDownProps {
  endTime: number;
  onFinish?: Function;
  children?: (time: ITimeType) => ReactElement;
}

export const CountTimeDown: FC<ICountTimeDownProps> = ({ endTime, onFinish, children }) => {
  const timer = useRef<any>();
  const [time, setTime] = useState<ITimeType>({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  });

  useEffect(() => {
    if (endTime) countFn(endTime);
  }, [endTime]);

  useEffect(() => resetData, []);

  const resetData = () => {
    setTime({
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    });
    timer.current && clearInterval(timer.current);
  };

  const countFn = (timeVal: number) => {
    const endTimeVal = new Date(Number(timeVal)).getTime();
    let sysSecond = endTimeVal - new Date().getTime();

    timer.current = setInterval(() => {
      if (sysSecond > 1000) {
        sysSecond -= 1000;
        const day = Math.floor(sysSecond / 1000 / 3600 / 24);
        const hour = Math.floor((sysSecond / 1000 / 3600) % 24);
        const minute = Math.floor((sysSecond / 1000 / 60) % 60);
        const second = Math.floor((sysSecond / 1000) % 60);

        setTime({
          day,
          hour: hour < 10 ? "0" + hour : hour,
          minute: minute < 10 ? "0" + minute : minute,
          second: second < 10 ? "0" + second : second
        });
      } else {
        resetData();
        onFinish && onFinish();
      }
    }, 1000);
  };

  return (
    <>
      {children ? (
        children(time)
      ) : (
        <View style={{ fontSize: "64rpx" }} className='dincond'>
          {time.minute}:{time.second}
        </View>
      )}
    </>
  );
};
