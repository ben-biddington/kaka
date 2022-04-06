import { Position } from "core/position";
import { Route } from "core/route";

export type BusStop = {
  id: string;
  name?: string;
  code?: string;
  position?: Position;
  routeIds?: number[],
  routes?: Route[],
};
