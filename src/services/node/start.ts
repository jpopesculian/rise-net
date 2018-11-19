import {
  NETWORK,
  PORT,
  VERSION
} from "../../helpers/constants/node/default-config";
import { buildConfigDir } from "../../helpers/services/node/build-config-dir";
import {
  createDockerMountFlags
} from "../../helpers/services/node/create-docker-mount-flags";
import {
  hasVersionImage,
  imageName
} from "../../helpers/services/node/image-version";
import { prefixed } from "../../helpers/services/node/namespace";
import { sh } from "../../helpers/sh";
import { ICommandFlags } from "../../helpers/types/command-flags";

import { buildNode } from "./build";

interface INodeStartFlags extends ICommandFlags {
  port?: number,
  configFile?: string,
  network?: string,
  version?: string
}

export const startNode = async (
  name: string,
  {
    port = PORT,
    network = NETWORK,
    version = VERSION,
    configFile
  }: INodeStartFlags
): Promise<number> => {
  if (!await hasVersionImage(version)) {
    await buildNode(version);
  }
  return sh`docker run -it --rm
    -p ${port}:${PORT}
    --name "${prefixed(name)}"
    ${createDockerMountFlags(name, await buildConfigDir(network, configFile))}
    ${imageName(version)}`;
};
