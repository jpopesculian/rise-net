import { EventEmitter } from "events";
import { map } from "lodash/fp";

import { getNodesWithRunning } from "../../db/node/running";
import { dummyLogger } from "../../helpers/logger";

import { stopNode } from "./stop";

export const stopAllNodes = async (opts: { remove: boolean }) => {
  const nodes = getNodesWithRunning();
  EventEmitter.defaultMaxListeners = nodes.length * 10;
  return Promise.all(
    map(
      node => stopNode(node.toString(), { ...opts, logger: dummyLogger }),
      nodes
    )
  );
};
