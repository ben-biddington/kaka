import { Request, Response } from "express";
import { Log } from "ports/log";
import { Internet } from "ports/internet";

export type Options = {
  headers: Record<string, string>;
};

export type Ports = {
  log: Log;
  internet: Internet;
};

export const forwardGet = async (
  { log, internet }: Ports,
  req: Request,
  res: Response,
  replacement: (request: Request) => string,
  opts?: Options
) => {
  const url = replacement(req);

  log.info(JSON.stringify(req.headers, null, 2));

  // [HACK]
  const authHeaders = {
    "x-Author": req.headers["x-author"]?.toString(),
    "x-api-key": req.headers["x-api-key"]?.toString(),
  };

  const headers = { ...authHeaders, ...(opts?.headers || {}) };

  log.info(`forwarding <${req.url}> to <${url}>`);
  log.info(JSON.stringify({ url: req.url, verb: "GET", headers }));

  const reply = await internet.fetch({ url, verb: "GET", headers });

  log.debug(reply.body);

  setHeaders(res, cacheControlHeaders());

  res.status(reply.status).send(reply.body);

  console.log(JSON.stringify(log, null, 2));
};

const setHeaders = (res, headers) => {
  Object.keys(headers).forEach((key) => {
    res.set(key, headers[key]);
  });
};

export const cacheControlHeaders = (maxAge = 60) => ({
  "Cache-Control": "public",
  "max-age": maxAge,
});
