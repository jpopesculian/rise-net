import { map } from "lodash/fp";

import { getNodesWithVolume } from "../../db/node/volume";

import { resetNode } from "./reset";

export const pruneNodes = async () => {
  const nodes = await getNodesWithVolume();
  return Promise.all(map(node => resetNode(node), nodes));
};
