import { writeFileSync } from "fs";
import { isEmpty, merge } from "lodash";
import * as path from "path";

export const createNodeConfigFromFile = async (
  configDir: string,
  filename?: string
) => {
  if (!filename || isEmpty(filename)) {
    return;
  }
  let config = await import(path.join(configDir, "node_config.json"));
  const filepath = path.isAbsolute(filename)
    ? filename
    : path.join(process.cwd(), filename);
  const importedConfig = await import(filepath);
  const configObj = isEmpty(importedConfig.default)
    ? importedConfig
    : importedConfig.default;
  config = merge(config, configObj);

  writeFileSync(
    path.join(configDir, "node_config.json"),
    JSON.stringify(config)
  );
};
