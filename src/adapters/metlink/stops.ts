import { Internet } from "ports/internet";
import { apiGatewayKey } from "adapters/metlink/auth";
import { Log } from "ports/log";
import { BusStop } from "core/bus-stop";
import { Stops } from "ports/stops";
import { DefaultInternet } from "adapters/internet/default-internet";

export type Ports = {
  internet: Internet;
  log?: Log;
};

export type Options = {
  baseUrl?: string;
  stopId: string;
};

export const stop = async (
  { internet, log }: Ports,
  { baseUrl = "https://backend.metlink.org.nz", stopId }: Options
) => {
  if (!stopId) throw new Error(`stopNumber is required`);

  const request = {
    verb: "get",
    url: `${baseUrl}/api/v1/stops/${stopId}`,
    headers: {
      "x-api-key": apiGatewayKey,
    },
  };

  log?.debug(`[request] ${JSON.stringify(request, null, 2)}`);

  const reply = await internet.fetch(request);

  const body = JSON.parse(reply.body);

  const result: BusStop = {
    id: body.stop_id,
    name: body.stop_name,
    code: body.stop_code,
    position: {
      lat: body.stop_lat,
      long: body.stop_lon,
    },
    routeIds: body.route_ids,
  };

  return result;

  // "body": {
  //   "stop_id": "4130",
  //   "stop_name": "Wilton Road at Warwick Street",
  //   "stop_code": "4130",
  //   "stop_lat": -41.267979,
  //   "stop_lon": 174.760231,
  //   "route_ids": [
  //     "140",
  //     "6730",
  //     "6740",
  //     "6850",
  //     "7430"
  //   ],
  //   "tags": [],
  //   "demand_info": {
  //     "default_dataset": "weekdays",
  //     "data": {
  //       "weekdays": [
  //         0.4,
  //         0.6,
  //         1.41,
  //         0.2,
  //         0.2,
  //         0.4,
  //         0.4,
  //         0.4,
  //         0.4,
  //         0.4,
  //         0.4,
  //         0.2,
  //         0.2,
  //         0.2,
  //         0.2,
  //         0
  //       ],
  //       "saturday": [
  //         0,
  //         0.2,
  //         0.2,
  //         0.2,
  //         0.6,
  //         0.2,
  //         0.4,
  //         0.2,
  //         1.21,
  //         0.4,
  //         0.2,
  //         0.2,
  //         0.4,
  //         0.2,
  //         0.2,
  //         0
  //       ],
  //       "sunday": [
  //         0,
  //         0,
  //         0.2,
  //         0.4,
  //         0.2,
  //         0.4,
  //         0.2,
  //         0.2,
  //         0.4,
  //         0.6,
  //         0.2,
  //         0.4,
  //         0.2,
  //         0.2,
  //         0.2,
  //         0.2
  //       ]
  //     }
  //   },
  //   "lastEdited": "2022-03-12T23:11:23+1300"
  // }

  log?.debug(`[reply] ${JSON.stringify(reply, null, 2)}`);
};

export class NetworkStops implements Stops {
  private log: Log;
  private baseUrl: string;

  constructor(log: Log, baseUrl: string) {
    this.log = log;
    this.baseUrl = baseUrl;
  }

  list = (ids: string[]) => {
    return Promise.all(
      ids.map((stopId) =>
        stop(
          { internet: new DefaultInternet(this.log) },
          { baseUrl: this.baseUrl, stopId }
        )
      )
    );
  };
}