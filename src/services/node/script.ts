import { readFileSync } from "fs";
import { isEmpty } from "lodash";

import { NETWORK } from "../../helpers/constants/node/default-config";
import { SRC } from "../../helpers/constants/node/paths";
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
import { escapeSh, sh } from "../../helpers/sh";
import { toAbsolutePath } from "../../helpers/to-absolute-path";
import { ICommandFlags } from "../../helpers/types/command-flags";

interface INodeScriptFlags extends ICommandFlags {
  configFile?: string,
  network?: string,
  version?: string,
  watch?: boolean,
  src?: string,
  entry?: string,
  args?: string
}

export const scriptNode = async (
  filename: string,
  name: string,
  {
    network = NETWORK,
    version,
    configFile,
    watch,
    entry,
    src,
    args
  }: INodeScriptFlags
): Promise<number> => {
  const hasSrc = !isEmpty(src);
  const scriptString = escapeSh(
    readFileSync(toAbsolutePath(filename)).toString()
  );
  version = await initContainerImage(name, version);
  return sh`docker run -it --rm
    --name "${prefixed(name)}"
    ${await createLocalUserIdFlag({ src })}
    ${hasSrc ? `--mount "type=bind,src=${toAbsolutePath(src!)},dst=${SRC}"` : ""}
    ${createDockerMountFlags(name, await buildConfigDir({
      network,
      configFile,
      watch,
      entry
    }))}
    ${imageName(version)}
    run-node script ${scriptString} ${args}`;
};
