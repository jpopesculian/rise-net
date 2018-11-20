import { writeFileSync } from "fs";
import { isEmpty, merge } from "lodash";
import * as path from "path";

import { toAbsolutePath } from "../../to-absolute-path";

export const createNodeConfigFromFile = async (
  configDir: string,
  filename?: string
) => {
  if (!filename || isEmpty(filename)) {
    return;
  }
  const configFile = path.join(configDir, "node_config.json");
  let config = await import(configFile);
  const importedConfig = await import(toAbsolutePath(filename));
  const configObj = isEmpty(importedConfig.default)
    ? importedConfig
    : importedConfig.default;
  config = merge(config, configObj);

  writeFileSync(configFile, JSON.stringify(config));
};
