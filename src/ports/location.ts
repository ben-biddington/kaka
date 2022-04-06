import { Position } from "core/position";

export interface Location {
  get: () => Promise<Position>;
}
