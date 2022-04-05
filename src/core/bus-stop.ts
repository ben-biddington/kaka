import { Position } from "core/position";

export type BusStop = {
  id: string;
  name: string;
  code: string;
  position: Position;
  routes: number[],
};
