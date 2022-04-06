import axios, { AxiosRequestConfig, Method } from "axios";
import { Internet, Request, Response } from "ports/internet";
import { Log } from "ports/log";

export class DefaultInternet implements Internet {
  private readonly log: Log;
  constructor(log: Log) {
    this.log = log;
  }

  fetch = async (request: Request) => {
    const config: AxiosRequestConfig = {
      method: request.verb as Method, // dumb
      url: request.url,
      headers: request.headers,
      timeout: 5000,
      validateStatus: () => true,
    };

    this.log.debug(`[DefaultInternet] ${JSON.stringify(config, null, 2)}`);

    const r = await axios.request(config);

    const result = {
      url: request.url,
      status: r.status,
      headers: r.headers,
      body: JSON.stringify(r.data),
    };

    this.log.debug(`[DefaultInternet] ${JSON.stringify(result, null, 2)}`);

    return result;
  };
}
