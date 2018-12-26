import { EventEmitter } from "events";
import { filter, map } from "lodash/fp";

import { getNodesWithVolume } from "../../db/node/volume";
import { isNetworkNamed } from "../../helpers/services/net/namespace";

import { resetNode } from "../node/reset";

export const resetNet = async (label: string) => {
  const nodes = filter(isNetworkNamed(label), await getNodesWithVolume());
  EventEmitter.defaultMaxListeners = nodes.length * 10;
  return Promise.all(map(node => resetNode(node), nodes));
};
