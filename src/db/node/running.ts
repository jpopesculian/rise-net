import { first } from "lodash/fp";

import { db } from "../db";

import { getKey } from "./namespace";

const RUNNING = "running";

export const setRunning = async (name: string, running: boolean) => {
  return (await db()).set(`${getKey(name)}.${RUNNING}`, running).write();
};

export const getRunning = async (name: string): Promise<string> => {
  return (await db()).get(`${getKey(name)}.${RUNNING}`).value();
};

export const getNodesWithRunning = async (): Promise<string[]> => {
  return (await db())
    .get(getKey())
    .entries()
    .filter(([, node]: [string, any]) => {
      return !!node[RUNNING];
    })
    .map(first)
    .value();
};
