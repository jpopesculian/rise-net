import { map, update } from "lodash/fp";

import { IAccount } from "../../helpers/types/accounts";
import { db } from "../db";

import { getKey } from "./namespace";

const LIST = "list";

type accountFilter = (account: IAccount) => boolean;

export const setList = (name: string, list: IAccount[]) => {
  return db.set(`${getKey(name)}.${LIST}`, list).write();
};

export const getList = (name: string, filter: (object | accountFilter) = {}): IAccount[] => {
  return map((account: IAccount): IAccount => {
    return update(
      "privateKey",
      Buffer.from,
      update("publicKey", Buffer.from, account)
    );
  }, db.get(`${getKey(name)}.${LIST}`).filter(filter).value() as IAccount[]);
};
