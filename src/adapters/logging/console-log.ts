import { Log } from "ports/log";

export class ConsoleLog implements Log {
  private readonly debugOn: boolean = false;

  constructor() {
    this.debugOn = process.env.DEBUG === "1";
  }

  debug = (m: string) => {
    if (this.debugOn) {
      console.log(`[dbg] ${m}`);
    }
  };

  info = (m: string) => {
    console.log(`[dbg] ${m}`);
  };

  error = (m: string) => {
    console.log(`[dbg] ${m}`);
  };
}
