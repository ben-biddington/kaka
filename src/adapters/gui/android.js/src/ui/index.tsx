import { render } from "solid-js/web";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";

import { Application } from "core/application";
import { initialState, State } from "core/state";

export type Props = {
  application: Application;
};

export const Root = (props: Props) => {
  const [state, setState] = createSignal<State>(initialState());

  onMount(() => {
    props.application.subscribe(setState);
  });

  return <>
    <div>A B C</div>
    <div>location: {state()?.location?.lat}, {state()?.location?.long}</div>
    <ul>
      <For each={state().stops} children={(item) => <>
        <li>{item.code} {item.name} ({item.routes?.map(it => it.shortName).join(", ")})</li>
      </>} />
    </ul> 
  </>
}

export const mount = (el, application: Application) =>
  render(() => <Root application={application} />, el);
