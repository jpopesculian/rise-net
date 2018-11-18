import { /* dummyLogger, */ ILogger } from "../../helpers/logger";
import { createConfigDir } from "../../helpers/services/node/create-config-dir";
import {
  createNetworkFile
} from "../../helpers/services/node/create-network-file";
import {
  createNodeConfigFromFile
} from "../../helpers/services/node/create-node-config-from-file";
import { prefixed } from "../../helpers/services/node/namespace";
import { sh } from "../../helpers/sh";
import { ICommandFlags } from "../../helpers/types/command-flags";

interface INodeStartFlags extends ICommandFlags {
  port?: number,
  configFile?: string,
  network?: string,
  logger: ILogger
}

export const startNode = async (
  name: string,
  { port = 5555, network = "mainnet", configFile }: INodeStartFlags
): Promise<any> => {
  const prefix = prefixed(name);
  const configDir = await createConfigDir();
  await createNodeConfigFromFile(configDir, configFile);
  await createNetworkFile(configDir, network);
  return sh`docker run -it
    -p ${port}:5555
    --rm
    --name "${prefix}"
    --mount "type=volume,src=${prefix}-data,dst=/home/rise/out/data"
    --mount "type=volume,src=${prefix}-logs,dst=/home/rise/out/logs"
    --mount "type=bind,src=${configDir},dst=/home/rise/out/etc"
    rise-node`;
};
