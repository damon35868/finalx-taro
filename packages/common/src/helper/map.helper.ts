import { getLocation } from "@tarojs/taro";
import { config } from "../config";

const mapConfig = config.component.map;
type Coordinate = { lat: number; lng: number };
class MapHelper {
  // 判断是否在园区的距离 米
  private distance = mapConfig.distance;

  //计算两个经纬度之间距离
  public async calcScope({
    target,
    current,
    distance
  }: {
    distance?: number;
    target: Coordinate;
    current?: Coordinate;
  }): Promise<{ scope: number; inScope: boolean; coordinate: number }> {
    current =
      current ||
      (await new Promise((resove, reject) => {
        getLocation({
          type: "gcj02",
          isHighAccuracy: true,
          fail: e => reject(e),
          success: res => {
            resove({ lat: res.latitude, lng: res.longitude });
          }
        });
      }));

    const { lat: lat1, lng: lng1 } = current || ({} as Coordinate);
    const { lat: lat2, lng: lng2 } = target || {};

    //进行经纬度转换为距离的计算
    const radLat1 = this.rad(lat1);
    const radLat2 = this.rad(lat2);
    const space1 = radLat1 - radLat2;
    const space2 = this.rad(lng1) - this.rad(lng2);

    let scope =
      2 * Math.asin(Math.sqrt(Math.pow(Math.sin(space1 / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(space2 / 2), 2)));
    scope = scope * 6378.137;

    // 输出为公里
    // scope = Math.round(scope * 10000) / 10000

    // 输出为米
    scope = (Math.round(scope * 10000) / 10000) * 1000;

    return {
      scope,
      inScope: scope <= (distance || this.distance),
      coordinate: this.calculateBearing({ current: current as Coordinate, target })
    };
  }

  public refreshScope(latitude: number, longitude: number, show?: boolean): Promise<number> {
    return new Promise((resove, reject) => {
      if (!mapConfig.mapSDK) return reject("[缺少SDK]");
      mapConfig.mapSDK.reverseGeocoder({
        location: { latitude, longitude },
        async success({ result }: any) {
          show && console.log("[--位置信息--]", result);
          const { location } = result || {};

          const { scope } = await this.calcScope({
            current: { lat: location.lat, lng: location.lng },
            target: { lat: mapConfig.center.latitude, lng: mapConfig.center.longitude }
          });
          resove(scope);
        },
        fail: error => reject(error)
      });
    });
  }

  public initMarkers({ latitude, longitude, pois }: { latitude?: number; longitude?: number; pois: any[] }): any[] {
    const markers = pois.map((item, key) => {
      const title = item.title;
      const lat = item.location.lat;
      const lng = item.location.lng;

      return {
        id: key + 1,
        latitude: lat,
        longitude: lng,
        callout: {
          content: title,
          padding: 12,
          fontSize: 14,
          display: "ALWAYS",
          textAlign: "center",
          borderRadius: 4,
          borderWidth: 2,
          bgColor: "#ffffff"
        }
      };
    });

    latitude &&
      longitude &&
      markers.unshift({
        id: 0,
        latitude,
        longitude,
        callout: {
          content: "你的起点",
          padding: 12,
          fontSize: 14,
          display: "ALWAYS",
          textAlign: "center",
          borderRadius: 4,
          borderWidth: 2,
          bgColor: "#ffffff"
        }
      });

    return markers;
  }

  private rad(d) {
    return (d * Math.PI) / 180.0;
  }

  public calculateBearing({ current, target }: { target: Coordinate; current: Coordinate }) {
    const dx = target.lat - current.lat;
    const dy = target.lng - current.lng;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (angle < 0) angle += 360;
    return angle;
  }
}

export const mapHelper = new MapHelper();
