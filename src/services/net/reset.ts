import { filter, map } from "lodash/fp";

import { getNodesWithVolume } from "../../db/node/volume";
import { isNetworkNamed } from "../../helpers/services/net/namespace";

import { resetNode } from "../node/reset";

export const resetNet = async (label: string) => {
  const nodes = filter(isNetworkNamed(label), await getNodesWithVolume());
  return Promise.all(map(node => resetNode(node), nodes));
};
