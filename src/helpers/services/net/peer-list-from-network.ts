import { EventEmitter } from "events";
import { isEmpty, map, reject } from "lodash/fp";

import { getNodesWithNetwork } from "../../../db/node/network";
import { NETWORK } from "../../constants/net/namespace";
import { inspectNodeContainer } from "../node/inspect-node-container";

interface IPeer {
  ip: string;
  port: number;
}
export const peerListFromNetwork = async (
  network: string
): Promise<IPeer[]> => {
  const nodes = getNodesWithNetwork(network);
  EventEmitter.defaultMaxListeners = nodes.length * 10;
  return map(
    container => ({
      ip: container.NetworkSettings.Networks[NETWORK].IPAddress,
      port: 5555
    }),
    reject(isEmpty, await Promise.all(map(inspectNodeContainer, nodes)))
  );
};
