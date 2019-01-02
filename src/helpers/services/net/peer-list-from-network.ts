import { includes, isEmpty, map, reject } from "lodash/fp";

import { getNodesWithNetwork } from "../../../db/node/network";
import { NETWORK } from "../../constants/net/namespace";
import { inspectNodeContainer } from "../node/inspect-node-container";

interface IPeer {
  ip: string;
  port: number;
}
export const peerListFromNetwork = async (
  netName: string,
  except?: string[]
): Promise<IPeer[]> => {
  let nodes = await getNodesWithNetwork(netName);
  if (except) {
    nodes = reject(node => includes(node, except), nodes);
  }
  return map(
    container => ({
      ip: container.NetworkSettings.Networks[NETWORK].IPAddress,
      port: 5555
    }),
    reject(isEmpty, await Promise.all(map(inspectNodeContainer, nodes)))
  );
};
