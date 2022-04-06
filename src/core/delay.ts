export const delay = (ms: number) => new Promise<void>(accept => {
  setTimeout(() => {
    accept();
  }, ms)
});