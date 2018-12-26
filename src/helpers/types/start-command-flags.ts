import { ICommandFlags } from "./command-flags";

export interface IStartCommandFlags extends ICommandFlags {
  configFile?: string;
  version?: string;
  watch?: boolean;
  src?: string;
  entry?: string;
}
