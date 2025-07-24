import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import React, { CSSProperties, FC } from "react";
import { Fragment } from "react/jsx-runtime";
import "./index.scss";

export const Marquee: FC<{ texts: string[]; placeholder?: string; style?: CSSProperties }> = ({
  texts = [],
  placeholder = "暂无公告",
  style = {}
}) => {
  const staticMarquee = Array.isArray(texts) && !!texts.length;

  return (
    <View style={style} className={classNames("fx_marquee", { marquee: staticMarquee })}>
      {!Array.isArray(texts) ? (
        "数据加载中"
      ) : !!texts.length ? (
        <Text>
          {texts.map(({ content }, key) => (
            <Fragment key={key}>
              {content}
              {key + 1 >= texts.length ? null : <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>}
            </Fragment>
          ))}
        </Text>
      ) : (
        placeholder
      )}
    </View>
  );
};
