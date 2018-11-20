import { addWatchFlagToConfig } from "./add-watch-flag-to-config";
import { createConfigDir } from "./create-config-dir";
import { createNetworkFile } from "./create-network-file";
import { createNodeConfigFromFile } from "./create-node-config-from-file";

interface IConfigDirFlags {
  network: string,
  configFile?: string,
  watch?: boolean
}

export const buildConfigDir = async ({
  network,
  configFile,
  watch
}: IConfigDirFlags): Promise<string> => {
  const configDir = await createConfigDir();
  await createNodeConfigFromFile(configDir, configFile);
  await createNetworkFile(configDir, network);
  await addWatchFlagToConfig(configDir, network, watch);
  return configDir;
};
