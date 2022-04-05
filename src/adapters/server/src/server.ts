import { Application, Request, Response } from "express";
//@ts-ignore
import express from "express";
import { forwardGet } from "./internal/forwarding";
import { ConsoleLog } from "../../../adapters/logging/console-log";
import { DefaultInternet } from "../../../adapters/internet/default-internet";

const app: Application = express();
const port = process.env.PORT || 3000;
const log = new ConsoleLog();
const internet = new DefaultInternet(log);
app.use(express.static("../build"));

// https://backend.metlink.org.nz/api/v1/stops/4130
app.get(/api\/v1\/stops/, async (req: Request, res: Response) =>
  forwardGet({ log, internet }, req, res, (req) =>
    req.url.replace("/api", "https://backend.metlink.org.nz/api")
  )
);

// https://api.opendata.metlink.org.nz/v1/stop-predictions?stop_id=4130
app.get(/v1\/stop-predictions/, async (req: Request, res: Response) =>
  forwardGet({ log, internet }, req, res, (req) =>
    req.url.replace("/v1/stop-predictions", "https://api.opendata.metlink.org.nz/v1/stop-predictions")
  )
);

app.listen(port, (): void => {
  console.log(`Connected successfully on port ${port}`);
});
