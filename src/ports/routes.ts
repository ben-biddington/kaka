import { Route } from "core/route";

export interface Routes {
  list: (stopId: string) => Promise<Route[]>;
}