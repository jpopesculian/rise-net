import { BSON } from "bsonfy";
import * as low from "lowdb";
import * as FileAsync from "lowdb/adapters/FileAsync";
import * as path from "path";

const defaultValue = {
  node: {},
  accounts: {},
  net: {}
};

const adapter = new FileAsync(
  path.join(__dirname, "..", "..", "db", "risenet.db"),
  {
    //tslint:disable-next-line
    defaultValue: defaultValue as object,
    serialize: data => {
      return Buffer.from(
        BSON.serialize(JSON.parse(JSON.stringify(data)))
      ).toString("base64");
    },
    deserialize: data => {
      return BSON.deserialize(Buffer.from(data, "base64"));
    }
  }
);

export const db = () => low(adapter);

export const createKey = (...prefixes: string[]) => (
  ...suffixes: string[]
): string => {
  return [...prefixes, ...suffixes].join(".");
};
