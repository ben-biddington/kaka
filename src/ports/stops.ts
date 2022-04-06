import { BusStop } from "core/bus-stop";

export interface Stops {
  list: (ids: string[]) => Promise<BusStop[]>;
}