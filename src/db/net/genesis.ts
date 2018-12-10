import { db } from "../db";

import { getKey } from "./namespace";

const GENESIS = "genesis";

export const setGenesis = (name: string, genesis: object) => {
  return db.set(`${getKey(name)}.${GENESIS}`, genesis).write();
};

export const getGenesis = (name: string): object => {
  return db.get(`${getKey(name)}.${GENESIS}`).value();
};
