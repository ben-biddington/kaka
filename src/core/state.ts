import { Position } from "core/position";
import { BusStop } from "core/bus-stop";

export type State = {
  location?: Position;
  stops?: BusStop[];
};

export const initialState = () => ({
  location: null,
  stops: [],
});
