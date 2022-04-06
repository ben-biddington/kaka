import { Internet } from "ports/internet";
import { apiGatewayKey } from "adapters/metlink/auth";
import { Log } from "ports/log";
import { BusStop } from "core/bus-stop";
import { Stops } from "ports/stops";
import { DefaultInternet } from "adapters/internet/default-internet";
import { Routes } from "ports/routes";

export type Ports = {
  internet: Internet;
  log?: Log;
};

export type Options = {
  baseUrl?: string;
  stopId: string;
};

export class NetworkRoutes implements Routes {
  private ports: Ports;
  private baseUrl: string;

  constructor(ports: Ports, baseUrl: string = "https://api.opendata.metlink.org.nz") {
    this.ports = ports;
    this.baseUrl = baseUrl;
  }

  list = async (stopId: string) => {
    if (!stopId) throw new Error(`stopId is required`);

  const request = {
    verb: "get",
    url: `${this.baseUrl}/v1/gtfs/routes?stop_id=${stopId}`,
    headers: {
      "x-api-key": apiGatewayKey,
    },
  };

  this.ports.log?.debug(`[request] ${JSON.stringify(request, null, 2)}`);

  const reply = await this.ports.internet.fetch(request);

  // {
  //   "id": 42,
  //   "route_id": "140",
  //   "agency_id": "NBM",
  //   "route_short_name": "14",
  //   "route_long_name": "Wilton - Wellington - Roseneath - Hataitai - Kilbirnie",
  //   "route_desc": "Kilbirnie - Hataitai - Roseneath - Wellington - Wilton",
  //   "route_type": 3,
  //   "route_color": "6cace4",
  //   "route_text_color": "000000",
  //   "route_url": ""
  // },

  const body = JSON.parse(reply.body);

  return body.map((it) => ({
    id: it.id,
    shortName: it.route_short_name,
    longName: it.route_long_name,
    colour: it.route_color
  }));
  };
}