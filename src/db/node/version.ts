import { db } from "../db";

import { getKey } from "./namespace";

const VERSION = "version";

export const setVersion = async (name: string, version: string) => {
  return (await db()).set(`${getKey(name)}.${VERSION}`, version).write();
};

export const getVersion = async (name: string): Promise<string> => {
  return (await db()).get(`${getKey(name)}.${VERSION}`).value();
};
