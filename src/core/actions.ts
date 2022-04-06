import { createAction } from "@reduxjs/toolkit";
export { Action } from "@reduxjs/toolkit";

export const findLocation = createAction("location/find");

export type LoadStopsOptions = {
  stopIds: string[],
  routeNames?: string[]; // "14", "22" etc
};

export const loadStops = createAction<LoadStopsOptions>("stops/load");

export const setRoutes = createAction<string>("routes/set");
