import { isEmpty } from "lodash";

import { ID, NETWORK } from "../../helpers/constants/node/default-config";
import { DOWNLOADS } from "../../helpers/constants/node/paths";
import { SNAPSHOT } from "../../helpers/constants/node/url";
import { download } from "../../helpers/download";
import { buildConfigDir } from "../../helpers/services/node/build-config-dir";
import {
  buildDownloadsDir
} from "../../helpers/services/node/build-downloads-dir";
import {
  createDockerMountFlags
} from "../../helpers/services/node/create-docker-mount-flags";
import {
  imageName,
  initContainerImage
} from "../../helpers/services/node/image-version";
import { prefixed } from "../../helpers/services/node/namespace";
import { sh } from "../../helpers/sh";
import { ICommandFlags } from "../../helpers/types/command-flags";

interface ILoadSnapshotFlags extends ICommandFlags {
  network?: string,
  file?: string,
  name?: string,
  version?: string
}

export const loadSnapshot = async ({
  network = NETWORK,
  name = ID,
  version,
  file
}: ILoadSnapshotFlags) => {
  if (!file || isEmpty(file)) {
    file = await download(`${SNAPSHOT}/${network}/latest`);
  }
  version = await initContainerImage(name, version);
  return sh`docker run -it --rm
    --name "${prefixed(name)}"
    ${createDockerMountFlags(name, await buildConfigDir({ network }))}
    --mount "type=bind,src=${await buildDownloadsDir(file)},dst=${DOWNLOADS}"
    ${imageName(version)}
    manager restoreBackup ${DOWNLOADS}/snapshot.gz`;
};
