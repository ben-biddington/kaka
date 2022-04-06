import { Location } from "ports/location";
import { Ports } from "ports/ports";
import { Log } from "ports/log";
import { Stops } from "ports/stops";
import { Routes } from "./routes";

export class PortsBuilder {
  private ports: Ports;

  constructor(ports: Ports = {}) {
    this.ports = ports;
  }

  static blank() {
    return new PortsBuilder();
  }

  static new(): PortsBuilder {
    return new PortsBuilder().withLog(new DevNullLog());
  }

  withLog(port: Log): PortsBuilder {
    this.ports.log = port;
    return this;
  }

  withLocation(port: Location): PortsBuilder {
    this.ports.location = port;
    return this;
  }

  withStops(port: Stops): PortsBuilder {
    this.ports.stops = port;
    return this;
  }

  withRoutes(port: Routes): PortsBuilder {
    this.ports.routes = port;
    return this;
  }

  build() {
    return { ...this.ports };
  }
}

class DevNullLog implements Log {
  info = (m: string) => {};
  debug = (m: string) => {};
  error = (m: string) => {};
}
