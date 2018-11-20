import { first } from "lodash";

import { prefixed } from "../../helpers/services/node/namespace";
import { shp } from "../../helpers/sh";

export const stopNode = async (name: string) => {
  const containerId = first(
    (await shp`docker container ls -f name=${prefixed(name)} -aq`)
      .toString()
      .split(/\s+/g)
  );
  if (!containerId) {
    throw new Error("Node is not currently running");
  }
  await shp`docker container stop ${containerId}`;
};
