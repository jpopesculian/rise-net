import { first } from "lodash";

import {
  deleteBoundMounts
} from "../../helpers/services/node/delete-bound-mounts";
import { prefixed } from "../../helpers/services/node/namespace";
import { shp } from "../../helpers/sh";

import { resetNode } from "./reset";

export const stopNode = async (
  name: string,
  { remove }: { remove: boolean }
) => {
  const containerId = first(
    (await shp`docker container ls -f name=${prefixed(name)} -aq`)
      .toString()
      .split(/\s+/g)
  );
  if (!containerId) {
    throw new Error("Node is not currently running");
  }
  await deleteBoundMounts(containerId);
  await shp`docker container stop ${containerId}`;
  if (remove) {
    await resetNode(name);
  }
};
