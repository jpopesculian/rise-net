import { first } from "lodash/fp";

import { db } from "../db";

import { getKey } from "./namespace";

const VOLUME = "volume";

export const setVolume = async (name: string, volume: boolean) => {
  return (await db()).set(`${getKey(name)}.${VOLUME}`, volume).write();
};

export const getVolume = async (name: string): Promise<string> => {
  return (await db()).get(`${getKey(name)}.${VOLUME}`).value();
};

export const getNodesWithVolume = async (): Promise<string[]> => {
  return (await db())
    .get(getKey())
    .entries()
    .filter(([, node]: [string, any]) => {
      return !!node[VOLUME];
    })
    .map(first)
    .value();
};
