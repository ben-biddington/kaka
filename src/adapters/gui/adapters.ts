import { PortsBuilder } from "ports/ports-builder";
import { BrowserLocation } from "adapters/browser/location";
import { Application } from "core/application";
import { findLocation, loadStops } from "core/actions";
import { Log } from "ports/log";
import { NetworkStops } from "adapters/metlink/stops";
import { NetworkRoutes } from "adapters/metlink/route";
import { DefaultInternet } from "adapters/internet/default-internet";
export { QueryStringSettings } from "adapters/browser/query-string-settings";
export { QueryStringToggles } from "adapters/browser/query-string-toggles";

export enum LogLevel {
  Info = 0,
  Debug = 1,
  Error = 2,
}

export type Options = {
  baseUrl: string;
  logLevel: LogLevel;
};

export const create = async (opts?: Options) => {
  const application = new Application(createPorts(opts));

  await application.dispatch(findLocation());
  await application.dispatch(
    loadStops(
      { stopIds: ["4130", "5515", "5006"], /*routeNames: ["14"]*/ },
    )
  );

  return application;
};

const createPorts = (
  { baseUrl, logLevel }: Options = {
    baseUrl: undefined,
    logLevel: LogLevel.Info,
  }
) => {
  const log = new ConsoleLog(logLevel);
  const internet = new DefaultInternet(log);

  return PortsBuilder.blank()
    .withLog(log)
    .withLocation(new BrowserLocation(log))
    .withStops(new NetworkStops(log, baseUrl))
    .withRoutes(new NetworkRoutes({ log, internet }, baseUrl))
    .build();
};

class ConsoleLog implements Log {
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  info(m: string): void {
    console.log(m);
  }

  debug(m: string): void {
    if (this.logLevel >= LogLevel.Debug) {
      console.debug(m);
    }
  }

  error(m: string): void {
    if (this.logLevel >= LogLevel.Error) {
      console.error(m);
    }
  }
}
