import { /* dummyLogger, */ ILogger } from "../../helpers/logger";
import { createConfigDir } from "../../helpers/services/node/create-config-dir";
import {
  createNetworkFile
} from "../../helpers/services/node/create-network-file";
import {
  createNodeConfigFromFile
} from "../../helpers/services/node/create-node-config-from-file";
import { sh } from "../../helpers/sh";
import { ICommandFlags } from "../../helpers/types/command-flags";

interface INodeStartFlags extends ICommandFlags {
  port?: number,
  configFile?: string,
  network?: string,
  logger: ILogger
}

export const startNode = async ({
  port = 5555,
  network = "mainnet",
  configFile
}: INodeStartFlags): Promise<any> => {
  const configDir = await createConfigDir();
  await createNodeConfigFromFile(configDir, configFile);
  await createNetworkFile(configDir, network);
  return sh`docker run -it
    -p ${port}:5555
    --mount "type=volume,src=rise-node-data,dst=/home/rise/out/data"
    --mount "type=volume,src=rise-node-logs,dst=/home/rise/out/logs"
    --mount "type=bind,src=${configDir},dst=/home/rise/out/etc"
    --entrypoint bash
    rise-node`;
};
