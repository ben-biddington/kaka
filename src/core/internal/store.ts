import { BehaviorSubject } from "rxjs";
import { produce } from "immer";
import {
  Action,
  findLocation,
  loadStops,
  LoadStopsOptions,
} from "core/actions";
import { Ports } from "ports/ports";
import { State } from "core/state";

export class Store {
  private readonly ports: Ports;
  private readonly subject: BehaviorSubject<State>;

  constructor(ports: Ports, state: State) {
    this.ports = ports;
    this.subject = new BehaviorSubject<State>(state);
  }

  async dispatch(action: Action) {
    if (findLocation.match(action)) {
      const location = await this.ports.location?.get();
      this.subject.next(
        produce(this.subject.getValue(), (draft) => {
          draft.location = location;
        })
      );
    }

    if (loadStops.match(action)) {
      const options: LoadStopsOptions = action.payload;

      let stops = (await this.ports.stops?.list(options.stopIds)) || [];

      if (this.ports.routes) {
        stops = await Promise.all(
          stops.map(async (stop) => {
            const routes = await this.ports.routes.list(stop.id);

            const filtered = routes.filter(
              (it) =>
                options.routeNames === undefined ||
                options.routeNames.includes(it.shortName)
            );

            return {
              ...stop,
              routes: filtered,
            };
          })
        );
      }

      this.subject.next(
        produce(this.subject.getValue(), (draft) => {
          draft.stops = stops;
        })
      );
    }
  }

  subscribe(listener: (state: State) => void) {
    return this.subject.subscribe(listener).unsubscribe;
  }

  getState() {
    return this.subject.getValue();
  }
}
