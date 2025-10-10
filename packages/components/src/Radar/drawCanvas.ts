import { getWindowInfo } from "@tarojs/taro";

const windowW = getWindowInfo().windowWidth;
const centerPointX = windowW / 2;
const centerPointY = centerPointX;

const themes = {
  bgColor: "#0041FF",
  textColor: "rgba(51,51,51,0.4)",
  lineColor: "rgba(51,51,51,0.2)"
};

export const drawCanvas = {
  radius: centerPointX - rpx(200),

  init(ctx: any, radarData: any) {
    const sideNum = radarData.length;
    const angle = (Math.PI * 2) / sideNum;
    this.drawOutLine(ctx, sideNum, angle);
    this.drawInnerLine(ctx, sideNum, angle);
    this.drawLabels(ctx, radarData, sideNum, angle);
    this.drawActive(ctx, radarData, sideNum, angle);
    ctx.draw(false);
  },

  drawOutLine(ctx, sideNum, angle) {
    ctx.setStrokeStyle(themes.lineColor);
    const r = this.radius / 5; //单位半径

    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      const currR = r * (i + 1); //当前半径

      for (let j = 0; j < sideNum; j++) {
        const x = centerPointX + currR * Math.cos(angle * j + Math.PI / 3.3); //Math.PI/3.3是为了调整图形的偏移量，可自行设置
        const y = centerPointY + currR * Math.sin(angle * j + Math.PI / 3.3);
        ctx.lineTo(x, y); //实线
      }

      ctx.setLineDash(i === 4 ? [0, 0] : [2, 2]); //虚线
      ctx.closePath();
      ctx.stroke();
    }
  },

  drawInnerLine(ctx, sideNum, angle) {
    ctx.setStrokeStyle(themes.lineColor);
    ctx.beginPath();
    for (let i = 0; i < sideNum; i++) {
      const x = centerPointX + this.radius * Math.cos(angle * i + Math.PI / 3.3);
      const y = centerPointY + this.radius * Math.sin(angle * i + Math.PI / 3.3);
      ctx.moveTo(centerPointX, centerPointY);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  },

  drawLabels(ctx, radarVal, sideNum, angle) {
    ctx.setFontSize(rpx(20));
    ctx.setFillStyle(themes.textColor);

    for (let i = 0; i < sideNum; i++) {
      const x = parseInt(String(centerPointX + this.radius * Math.cos(angle * i + Math.PI / 3.3)));
      const y = parseInt(String(centerPointY + this.radius * Math.sin(angle * i + Math.PI / 3.3)));
      const center = parseInt(String(centerPointX));
      const centerY = parseInt(String(centerPointY));

      if (x < center && y < centerY) {
        ctx.setTextAlign("left");
        ctx.fillText(radarVal[i].label, x - rpx(70), y);
      } else if (x - rpx(20) > center && y < centerY) {
        ctx.setTextAlign("right");
        ctx.fillText(radarVal[i].label, x + rpx(70), y);
      } else if (y > centerY) {
        ctx.setTextAlign("center");
        ctx.fillText(radarVal[i].label, x, y + rpx(40));
      } else {
        ctx.setTextAlign("center");
        ctx.fillText(radarVal[i].label, x, y - rpx(20));
      }
    }
  },

  drawActive(ctx, radarVal, sideNum, angle) {
    ctx.beginPath();
    for (let i = 0; i < sideNum; i++) {
      const x = centerPointX + this.radius * Math.cos(angle * i + Math.PI / 3.3) * (radarVal[i].value / 100);
      const y = centerPointY + this.radius * Math.sin(angle * i + Math.PI / 3.3) * (radarVal[i].value / 100);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.setFillStyle(themes.bgColor); //填充色
    ctx.fill(); //填充
    ctx.stroke();
  }
};

function rpx(param) {
  return Number(((windowW / 750) * param).toFixed(2));
}
