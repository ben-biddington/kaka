export interface Log {
  info(m: string): void;
  debug(m: string): void;
  error(m: string): void;
}
