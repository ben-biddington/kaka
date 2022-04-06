export class QueryStringToggles {
  private parameters: URLSearchParams;

  constructor(queryString) {
    this.parameters = new URLSearchParams(queryString);
  }

  get(name) {
    return ['true', '1', ''].includes(this.parameters.get(name));
  }
}