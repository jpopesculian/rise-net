export const cleanup = (callback: (code: number) => void) => {
  process.on("exit", code => {
    callback(code);
  });
  process.on("SIGINT", () => {
    process.exit(2);
  });
  process.on("uncaughtException", () => {
    process.exit(99);
  });
};
