import { addEntryToConfig } from "./add-entry-to-config";
import { addWatchFlagToConfig } from "./add-watch-flag-to-config";
import { createConfigDir } from "./create-config-dir";
import { createNetworkFile } from "./create-network-file";
import { createNodeConfigFromFile } from "./create-node-config-from-file";

interface IConfigDirFlags {
  network: string,
  configFile?: string,
  watch?: boolean,
  entry?: string,
  preserve?: boolean
}

export const buildConfigDir = async ({
  network,
  configFile,
  watch,
  entry,
  preserve
}: IConfigDirFlags): Promise<string> => {
  const configDir = await createConfigDir(!!preserve);
  await createNodeConfigFromFile(configDir, configFile);
  await createNetworkFile(configDir, network);
  await addWatchFlagToConfig(configDir, network, watch);
  await addEntryToConfig(configDir, network, entry);
  return configDir;
};
