import { db } from "../db";

import { getKey } from "./namespace";

const NETWORK = "network";

export const setNetwork = (name: string, network: string) => {
  return db.set(`${getKey(name)}.${NETWORK}`, network).write();
};

export const getNetwork = (name: string): string => {
  return db.get(`${getKey(name)}.${NETWORK}`).value();
};

export const getNodesWithNetwork = (network: string): string[] => {
  return db
    .get(getKey())
    .keys()
    .filter(k => {
      return db.get(getKey(k)).value()[NETWORK] === network;
    })
    .value();
};
