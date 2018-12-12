import * as low from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";
import * as path from "path";

const adapter = new FileSync(path.join(__dirname, "..", "..", "db", "db.json"));

export const db = low(adapter);

export const createKey = (...prefixes: string[]) => (
  ...suffixes: string[]
): string => {
  return [...prefixes, ...suffixes].join(".");
};

db.defaults({ node: {} });
