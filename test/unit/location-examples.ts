import { expect } from "chai";
import { findLocation, loadStops as loadStops } from "core/actions";
import { Application } from "core/application";
import { BusStop } from "core/bus-stop";
import { delay } from "core/delay";
import { Position } from "core/position";
import { Route } from "core/route";
import { Location } from "ports/location";
import { PortsBuilder } from "ports/ports-builder";
import { Routes } from "ports/routes";
import { Stops } from "ports/stops";

describe("Listing arrivals", () => {
  it("for example", async () => {
    const location = new MockLocation({ lat: 100, long: 200 });
    const application = new Application(
      PortsBuilder.blank().withLocation(location).build()
    );

    await application.dispatch(findLocation());

    expect(application.state.location).to.eql({ lat: 100, long: 200 });
  });
});

describe("Loading stops", () => {
  it("for example", async () => {
    const stopsLookup = new MockStops([{ id: "A" }, { id: "B" }]);

    const application = new Application(
      PortsBuilder.blank().withStops(stopsLookup).build()
    );

    await application.dispatch(loadStops({ stopIds: ["4130"] }));

    expect(application.state.stops).to.eql([{ id: "A" }, { id: "B" }]);
  });

  it("populates routes", async () => {
    const stopsLookup = new MockStops([{ id: "A" }]);
    const routesLookup = new MockRoutes([{ id: "14" }, { id: "22" }]);

    const application = new Application(
      PortsBuilder.blank()
        .withStops(stopsLookup)
        .withRoutes(routesLookup)
        .build()
    );

    await application.dispatch(loadStops({ stopIds: ["4130"] }));

    const stop = application.state.stops[0];

    expect(stop.id).to.eql("A");
    expect(stop.routes.map((it) => it.id)).to.eql(["14", "22"]);
  });

  // [i] "limit the number of network calls" there is only one call per stopId.
  it("allows filtering by route name to limit the number of network calls", async () => {
    const stopsLookup = new MockStops([{ id: "A" }]);
    const routesLookup = new MockRoutes([
      { id: "1", shortName: "14" },
      { id: "2", shortName: "22" },
    ]);

    const application = new Application(
      PortsBuilder.blank()
        .withStops(stopsLookup)
        .withRoutes(routesLookup)
        .build()
    );

    await application.dispatch(
      loadStops({ stopIds: ["4130"], routeNames: ["14"] })
    );

    const stop = application.state.stops[0];

    expect(stop.id).to.eql("A");
    expect(stop.routes.map((it) => it.shortName)).to.eql(["14"]);
  });
});

class MockRoutes implements Routes {
  private stops: Route[] = [];

  constructor(stops: Route[]) {
    this.stops = stops;
  }

  list: (stopId: string) => Promise<Route[]> = () =>
    delay(1000).then(() => this.stops);
}

class MockStops implements Stops {
  private stops: BusStop[] = [];

  constructor(stops: BusStop[]) {
    this.stops = stops;
  }

  list: (ids: string[]) => Promise<BusStop[]> = () =>
    delay(1000).then(() => this.stops);
}

class MockLocation implements Location {
  private position: Position;

  constructor(position: Position) {
    this.position = position;
  }

  get = () => delay(1000).then(() => this.position);
}
