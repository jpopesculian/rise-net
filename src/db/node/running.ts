import { db } from "../db";

import { getKey } from "./namespace";

const RUNNING = "running";

export const setRunning = (name: string, running: boolean) => {
  return db.set(`${getKey(name)}.${RUNNING}`, running).write();
};

export const getRunning = (name: string): string => {
  return db.get(`${getKey(name)}.${RUNNING}`).value();
};

export const getNodesWithRunning = (): string[] => {
  return db
    .get(getKey())
    .keys()
    .filter(k => {
      return db.get(getKey(k)).value()[RUNNING];
    })
    .value() as string[];
};
