import { DefaultInternet } from "adapters/internet/default-internet";
import { ConsoleLog } from "adapters/logging/console-log";
import { realTime } from "adapters/metlink/arrivals";
import { expect } from "chai";
import { dueIn } from "core/due";
import { Settings } from "test/integration/settings";

describe("Listing arrivals", () => {
  it("for example", async () => {
    const arrivals = await realTime(
      {
        internet: new DefaultInternet(new ConsoleLog()),
        log: new ConsoleLog(),
      },
      { stopId: "4130", baseUrl: Settings.baseUrl }
    );

    const actual = arrivals[0];

    console.log({ actual });

    expect(actual.stopId).to.eql("4130");
    expect(actual.origin).to.eql({
      id: "4136",
      name: "Wilton-SurreySt",
    });
    expect(actual.vehicleId).to.have.length.greaterThan(0);

    // console.log('aimed departure', dueIn(new Date(), actual.arrivalTime.aimed));
    // console.log('expected departure', dueIn(new Date(), actual.arrivalTime.expected));
  });

  it("allows filtering by service id");
});
