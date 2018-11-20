import { db } from "../db";

import { getKey } from "./namespace";

const VERSION = "version";

export const setVersion = (name: string, version: string) => {
  return db.set(`${getKey(name)}.${VERSION}`, version).write();
};

export const getVersion = (name: string): string => {
  return db.get(`${getKey(name)}.${VERSION}`).value();
};
