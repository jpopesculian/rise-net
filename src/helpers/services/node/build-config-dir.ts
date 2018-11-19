import { createConfigDir } from "./create-config-dir";
import { createNetworkFile } from "./create-network-file";
import { createNodeConfigFromFile } from "./create-node-config-from-file";

export const buildConfigDir = async (
  network: string,
  configFile?: string
): Promise<string> => {
  const configDir = await createConfigDir();
  await createNodeConfigFromFile(configDir, configFile);
  await createNetworkFile(configDir, network);
  return configDir;
};
