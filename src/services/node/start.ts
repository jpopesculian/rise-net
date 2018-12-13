import { isEmpty } from "lodash";

import { setRunning } from "../../db/node/running";
import { NETWORK, PORT } from "../../helpers/constants/node/default-config";
import { SRC } from "../../helpers/constants/node/paths";
import { buildDevnetMount } from "../../helpers/services/net/build-devnet-mount";
import { findOrCreateNetwork } from "../../helpers/services/net/find-or-create-network";
import { networkNamed } from "../../helpers/services/net/namespace";
import { updatePeerLists } from "../../helpers/services/net/update-peer-lists";
import { buildConfigDir } from "../../helpers/services/node/build-config-dir";
import { createDockerMountFlags } from "../../helpers/services/node/create-docker-mount-flags";
import { createLocalUserIdFlag } from "../../helpers/services/node/create-local-user-id-flag";
import {
  imageName,
  initContainerImage
} from "../../helpers/services/node/image-version";
import { waitUntilRunning } from "../../helpers/services/node/is-running";
import { prefixed } from "../../helpers/services/node/namespace";
import { sh } from "../../helpers/sh";
import { toAbsolutePath } from "../../helpers/to-absolute-path";
import { ICommandFlags } from "../../helpers/types/command-flags";
import { ITestNetConfig } from "../../helpers/types/testnet-config";

interface INodeStartFlags extends ICommandFlags {
  port?: number;
  configFile?: string;
  network?: string;
  version?: string;
  watch?: boolean;
  src?: string;
  entry?: string;
  daemon?: boolean;
  testnet?: ITestNetConfig;
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
    testnet,
    src
  }: INodeStartFlags
): Promise<number> => {
  name = testnet ? networkNamed(testnet) : name;
  const hasSrc = !isEmpty(src);
  version = await initContainerImage(name, version);

  if (testnet && !daemon) {
    waitUntilRunning(name).then(() => updatePeerLists(testnet));
  }
  setRunning(name, !daemon);
  let exitCode = 1;
  try {
    exitCode = await sh`docker run --rm
        ${daemon ? "-d" : "-it"}
        -p ${port}:${PORT}
        --name "${prefixed(name)}"
        --network "${await findOrCreateNetwork()}"
        ${await createLocalUserIdFlag({ src })}
        ${
          hasSrc
            ? `--mount "type=bind,src=${toAbsolutePath(src!)},dst=${SRC}"`
            : ""
        }
        ${createDockerMountFlags(
          name,
          await buildConfigDir({
            network: testnet ? "devnet" : network,
            configFile,
            watch,
            entry,
            preserve: !!daemon
          })
        )}
        ${testnet ? await buildDevnetMount(testnet, !!daemon) : ""}
        ${imageName(version)}
        run-node ${hasSrc ? "dev" : "start"} ${watch ? "--watch" : ""}`;
    // bash`;
  } finally {
    setRunning(name, !!daemon);
    if (testnet) {
      updatePeerLists(testnet);
    }
  }
  return exitCode;
};
