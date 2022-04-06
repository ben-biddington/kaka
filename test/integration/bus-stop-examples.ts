import { DefaultInternet } from "adapters/internet/default-internet";
import { ConsoleLog } from "adapters/logging/console-log";
import { stop } from "adapters/metlink/stops";
import { expect } from "chai";
import { Settings } from "test/integration/settings";

describe("Listing bus stop info", () => {
  it("for example", async () => {
    const busStop = await stop(
      {
        internet: new DefaultInternet(new ConsoleLog()),
        log: new ConsoleLog(),
      },
      { stopId: "4130", baseUrl: Settings.baseUrl }
    );

    expect(busStop.id).to.eql("4130");
    expect(busStop.name).to.eql("Wilton Road at Warwick Street");
    expect(busStop.code).to.eql("4130");
    expect(busStop.position).to.eql({
      lat: -41.267979,
      long: 174.760231,
    });
    expect(busStop.routeIds).to.eql(["140", "6730", "6740", "6850", "7430"]);
  });
});