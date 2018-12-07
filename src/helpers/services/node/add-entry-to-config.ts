import { writeFileSync } from "fs";
import { isEmpty, map, set } from "lodash/fp";
import * as path from "path";

export const addEntryToConfig = async (
  configDir: string,
  network: string,
  entry?: string
) => {
  if (isEmpty(entry)) {
    return;
  }
  const filename = path.join(configDir, `pm2-${network}.json`);
  const config = await import(filename);
  config.apps = map(set("script", entry), config.apps);
  writeFileSync(filename, JSON.stringify(config));
};
