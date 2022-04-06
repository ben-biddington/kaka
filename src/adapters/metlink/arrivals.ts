import { Internet } from "ports/internet";
import { apiGatewayKey } from "adapters/metlink/auth";
import { Log } from "ports/log";
import { BusStop } from "core/bus-stop";
import { Departure } from "core/departure";

export type Ports = {
  internet: Internet;
  log?: Log;
};

export type Options = {
  baseUrl?: string;
  stopId: string;
};

export const realTime = async (
  { internet, log }: Ports,
  { baseUrl = "https://api.opendata.metlink.org.nz", stopId }: Options
) => {
  if (!stopId) throw new Error(`stopNumber is required`);

  const request = {
    verb: "get",
    url: `${baseUrl}/v1/stop-predictions?stop_id=${stopId}`,
    headers: {
      "x-api-key": apiGatewayKey,
    },
  };

  log?.debug(`[request] ${JSON.stringify(request, null, 2)}`);

  const reply = await internet.fetch(request);

  if (reply.status !== 200)
    throw new Error(`Request failed: ${JSON.stringify(reply, null, 2)}`);

  const body = JSON.parse(reply.body);

  log?.debug(`[response] ${JSON.stringify(body, null, 2)}`);

  const departures = body.departures;

  // "departures": [
  //   {
  //     "stop_id": "4130",
  //     "service_id": "14",
  //     "direction": "inbound",
  //     "operator": "NBM",
  //     "origin": {
  //       "stop_id": "4136",
  //       "name": "Wilton-SurreySt"
  //     },
  //     "destination": {
  //       "stop_id": "6224",
  //       "name": "Kilbirnie"
  //     },
  //     "delay": "-PT42S",
  //     "vehicle_id": "2205",
  //     "name": "WiltonRd at Warwick",
  //     "arrival": {
  //       "aimed": "2022-04-06T12:43:00+12:00",
  //       "expected": "2022-04-06T12:42:18+12:00"
  //     },
  //     "departure": {
  //       "aimed": "2022-04-06T12:43:00+12:00",
  //       "expected": "2022-04-06T12:42:18+12:00"
  //     },
  //     "status": "ontime",
  //     "monitored": true,
  //     "wheelchair_accessible": true,
  //     "trip_id": "14__1__144__NBM__90__90_1"
  //   },

  const result: Departure[] = body.departures.map((it) => ({
    stopId: it.stop_id,
    origin: {
      id: it.origin.stop_id,
      name: it.origin.name,
    },
    destination: {
      id: it.destination.stop_id,
      name: it.destination.name,
    },
    status: it.status,
    arrivalTime: {
      aimed: new Date(it.arrival.aimed),
      expected: new Date(it.arrival.expected),
    },
    departureTime: {
      aimed: new Date(it.departure.aimed),
      expected: new Date(it.departure.expected),
    },
    vehicleId: it.vehicle_id,
  }));

  return result;
};
