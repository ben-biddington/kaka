export type Request = {
  url: string;
  verb: string;
  headers?: Record<string,string>;
}

export type Response = {
  url: string;
  status: number;
  headers?: Record<string,string>;
  body: string;
}

export interface Internet {
  fetch(request: Request) : Promise<Response>;
}