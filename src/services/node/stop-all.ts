import { map } from "lodash/fp";

import { getNodesWithRunning } from "../../db/node/running";
import { dummyLogger } from "../../helpers/logger";

import { stopNode } from "./stop";

export const stopAllNodes = async (opts: { remove: boolean }) => {
  const nodes = await getNodesWithRunning();
  return Promise.all(
    map(node => stopNode(node, { ...opts, logger: dummyLogger }), nodes)
  );
};
