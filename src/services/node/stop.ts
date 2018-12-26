import { first, isEmpty } from "lodash";

import { getRunning, setRunning } from "../../db/node/running";
import { dummyLogger } from "../../helpers/logger";
import { deleteBoundMounts } from "../../helpers/services/node/delete-bound-mounts";
import { prefixed } from "../../helpers/services/node/namespace";
import { shp } from "../../helpers/sh";
import { ICommandFlags } from "../../helpers/types/command-flags";

import { resetNode } from "./reset";

export const stopNode = async (
  name: string,
  { remove, logger = dummyLogger }: { remove: boolean } & ICommandFlags
) => {
  const containerId = first(
    (await shp`docker container ls -f name=${prefixed(name)} -aq`)
      .toString()
      .split(/\s+/g)
  );
  if (!containerId || isEmpty(containerId)) {
    logger("Node is not currently running");
  } else {
    await deleteBoundMounts(name);
    await shp`docker container stop ${containerId}`;
  }
  if (await getRunning(name)) {
    await setRunning(name, false);
  }
  if (remove) {
    await resetNode(name);
  }
};
