import { Ports } from "ports/ports";
import { Store } from "core/internal/store";
import { Action } from "core/actions";
import { initialState, State } from "core/state";

export class Application {
  private readonly store: Store;

  constructor(ports: Ports) {
    this.store = new Store(ports, initialState());
  }

  dispatch(action: Action) {
    return this.store.dispatch(action);
  }

  subscribe(listener: (state: State) => void) {
    listener(this.state);
    return this.store.subscribe(listener);
  }

  get state() {
    return this.store.getState();
  }
}
