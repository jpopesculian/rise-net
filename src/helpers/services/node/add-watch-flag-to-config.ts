import { writeFileSync } from "fs";
import { map, set } from "lodash/fp";
import * as path from "path";

export const addWatchFlagToConfig = async (
  configDir: string,
  network: string,
  watch?: boolean
) => {
  const filename = path.join(configDir, `pm2-${network}.json`);
  const config = await import(filename);
  config.apps = map(set("watch", watch), config.apps);
  writeFileSync(filename, JSON.stringify(config));
};
