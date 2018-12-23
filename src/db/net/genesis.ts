import { db } from "../db";

import { getKey } from "./namespace";

const GENESIS = "genesis";

export const setGenesis = async (name: string, genesis: object) => {
  return (await db()).set(`${getKey(name)}.${GENESIS}`, genesis).write();
};

export const getGenesis = async (name: string): Promise<object> => {
  return (await db()).get(`${getKey(name)}.${GENESIS}`).value();
};

export const hasGenesis = async (name: string): Promise<boolean> => {
  return (await db()).has(`${getKey(name)}.${GENESIS}`).value();
};
