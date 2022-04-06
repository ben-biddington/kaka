import { Log } from "ports/log";
import { Location } from "ports/location";
import { Stops } from "ports/stops";
import { Routes } from "ports/routes";

export type Ports = {
  log?: Log;
  location?: Location;
  stops?: Stops;
  routes?: Routes;
};
