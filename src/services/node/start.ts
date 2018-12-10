import { isEmpty } from "lodash";

import { NETWORK, PORT } from "../../helpers/constants/node/default-config";
import { SRC } from "../../helpers/constants/node/paths";
import { findOrCreateNetwork } from "../../helpers/services/net/find-or-create-network";
import { buildConfigDir } from "../../helpers/services/node/build-config-dir";
import {
  createDockerMountFlags
} from "../../helpers/services/node/create-docker-mount-flags";
import {
  createLocalUserIdFlag
} from "../../helpers/services/node/create-local-user-id-flag";
import {
  imageName,
  initContainerImage
} from "../../helpers/services/node/image-version";
import { prefixed } from "../../helpers/services/node/namespace";
import { sh } from "../../helpers/sh";
import { toAbsolutePath } from "../../helpers/to-absolute-path";
import { ICommandFlags } from "../../helpers/types/command-flags";

interface INodeStartFlags extends ICommandFlags {
  port?: number,
  configFile?: string,
  network?: string,
  version?: string,
  watch?: boolean,
  src?: string,
  entry?: string,
  daemon?: boolean
}

export const startNode = async (
  name: string,
  {
    port = PORT,
    network = NETWORK,
    version,
    configFile,
    watch,
    entry,
    daemon,
    src
  }: INodeStartFlags
): Promise<number> => {
  const hasSrc = !isEmpty(src);
  version = await initContainerImage(name, version);
  return sh`docker run --rm
    ${daemon ? "-d" : "-it"}
    -p ${port}:${PORT}
    --name "${prefixed(name)}"
    --network "${await findOrCreateNetwork()}"
    ${await createLocalUserIdFlag({ src })}
    ${hasSrc ? `--mount "type=bind,src=${toAbsolutePath(src!)},dst=${SRC}"` : ""}
    ${createDockerMountFlags(name, await buildConfigDir({
      network,
      configFile,
      watch,
      entry,
      preserve: !!daemon
    }))}
    ${imageName(version)}
    run-node ${hasSrc ? "dev" : "start"} ${watch ? "--watch" : ""}`;
  // bash`;
};
