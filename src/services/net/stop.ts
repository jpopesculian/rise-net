import { filter, map } from "lodash/fp";

import { getNodesWithRunning } from "../../db/node/running";
import { dummyLogger } from "../../helpers/logger";
import { isNetworkNamed } from "../../helpers/services/net/namespace";
import { stopNode } from "../node/stop";

export const stopNet = async (label: string, opts: { remove: boolean }) => {
  const nodes = filter(isNetworkNamed(label), await getNodesWithRunning());
  return Promise.all(
    map(node => stopNode(node, { ...opts, logger: dummyLogger }), nodes)
  );
};
