import { ILogger } from "./types/logger";

export const dummyLogger: ILogger = (..._args: any[]) => {
  return;
};
