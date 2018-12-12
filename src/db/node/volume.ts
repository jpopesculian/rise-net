import { db } from "../db";

import { getKey } from "./namespace";

const VOLUME = "volume";

export const setVolume = (name: string, volume: boolean) => {
  return db.set(`${getKey(name)}.${VOLUME}`, volume).write();
};

export const getVolume = (name: string): string => {
  return db.get(`${getKey(name)}.${VOLUME}`).value();
};

export const getNodesWithVolume = (): string[] => {
  return db
    .get(getKey())
    .keys()
    .filter(k => {
      return db.get(getKey(k)).value()[VOLUME];
    })
    .value() as string[];
};
