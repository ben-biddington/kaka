import { DefaultInternet } from "adapters/internet/default-internet";
import { ConsoleLog } from "adapters/logging/console-log";
import { NetworkRoutes } from "adapters/metlink/route";
import { expect } from "chai";

describe("Listing route info", () => {
  it("for example", async () => {
    const routes = new NetworkRoutes({
      internet: new DefaultInternet(new ConsoleLog()),
      log: new ConsoleLog(),
    });

    const allRoutes = await routes.list("4130");

    const route = allRoutes.find(it => it.shortName === '14');
    
    expect(route.shortName).to.eql("14");
    expect(route.id).to.eql(42);
    expect(route.longName).to.eql("Wilton - Wellington - Roseneath - Hataitai - Kilbirnie");
    expect(route.colour).to.not.be.undefined;
  });
});
