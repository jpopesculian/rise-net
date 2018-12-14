import { first } from "lodash/fp";

import { db } from "../db";

import { getKey } from "./namespace";

const NETWORK = "network";

export const setNetwork = async (name: string, network: string) => {
  return (await db()).set(`${getKey(name)}.${NETWORK}`, network).write();
};

export const getNetwork = async (name: string): Promise<string> => {
  return (await db()).get(`${getKey(name)}.${NETWORK}`).value();
};

export const getNodesWithNetwork = async (
  network: string
): Promise<string[]> => {
  return (await db())
    .get(getKey())
    .entries()
    .filter(([, node]: [string, any]) => {
      return node[NETWORK] === network;
    })
    .map(first)
    .value();
};
