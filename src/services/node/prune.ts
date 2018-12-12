import { EventEmitter } from "events";
import { map } from "lodash/fp";

import { getNodesWithVolume } from "../../db/node/volume";

import { resetNode } from "./reset";

export const pruneNodes = async () => {
  const nodes = getNodesWithVolume();
  EventEmitter.defaultMaxListeners = nodes.length * 10;
  return Promise.all(map(node => resetNode(node.toString()), nodes));
};
