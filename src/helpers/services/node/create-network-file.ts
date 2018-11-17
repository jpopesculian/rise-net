import { writeFileSync } from "fs";
import * as path from "path";

export const createNetworkFile = async (configDir: string, network: string) => {
  writeFileSync(path.join(configDir, ".network"), network);
};
