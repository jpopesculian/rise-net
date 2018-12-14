import * as low from "lowdb";
import * as FileAsync from "lowdb/adapters/FileAsync";
import * as path from "path";

const adapter = new FileAsync(
  path.join(__dirname, "..", "..", "db", "db.json")
);

export const db = () => low(adapter);

export const createKey = (...prefixes: string[]) => (
  ...suffixes: string[]
): string => {
  return [...prefixes, ...suffixes].join(".");
};
