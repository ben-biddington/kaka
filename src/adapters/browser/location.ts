import { Position } from "core/position";
import { Location } from "ports/location";
import { Log } from "ports/log";

export class BrowserLocation implements Location {
  private readonly log: Log;

  constructor(log: Log) {
    this.log = log;
  }

  get = async () => {
    const result = await this.getBrowserLocation();

    this.log.info(JSON.stringify(result, null, 2));

    return result;
  };

  private getBrowserLocation = () => new Promise<Position>(accept => {
    navigator.geolocation.getCurrentPosition((position) => {
      accept({ lat: position.coords.latitude, long: position.coords.longitude});
    });
  });
}
