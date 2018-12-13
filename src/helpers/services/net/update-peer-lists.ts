import { readFileSync, writeFileSync } from "fs";
import { find, get, map } from "lodash/fp";
import * as path from "path";

import { getNodesWithNetwork } from "../../../db/node/network";
import { DEVNET } from "../../constants/node/paths";
import { ITestNetConfig } from "../../types/testnet-config";
import { inspectNodeContainer } from "../node/inspect-node-container";

import { peerListFromNetwork } from "./peer-list-from-network";

const getConfigPath = async (node: string): Promise<string | undefined> => {
  const mount = find(
    { Type: "bind", Destination: DEVNET },
    (await inspectNodeContainer(node)).Mounts
  );
  if (!mount) {
    return;
  }
  return path.join(get("Source", mount) as string, "config.json");
};

const updatePeerListForNode = async (testnet: ITestNetConfig, node: string) => {
  const configPath = await getConfigPath(node);
  if (!configPath) {
    return;
  }
  const configBytes = readFileSync(configPath);
  if (configBytes.length < 1) {
    return;
  }
  const config = JSON.parse(configBytes.toString());
  config.peers.list = await peerListFromNetwork(testnet.netName, [node]);
  writeFileSync(configPath, JSON.stringify(config));
};

export const updatePeerLists = async (testnet: ITestNetConfig) => {
  const { netName } = testnet;
  map(
    node => updatePeerListForNode(testnet, node),
    getNodesWithNetwork(netName)
  );
};
