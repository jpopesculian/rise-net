import { update } from "lodash/fp";

import { IAccount } from "../../helpers/types/accounts";
import { db } from "../db";

import { getKey } from "./namespace";

const LIST = "list";

type accountFilter = (account: IAccount) => boolean;

export const setAccounts = async (name: string, list: IAccount[]) => {
  return (await db()).set(`${getKey(name)}.${LIST}`, list).write();
};

export const getAccounts = async (
  name: string,
  filter: object | accountFilter = {}
): Promise<IAccount[]> => {
  return (await db())
    .get(`${getKey(name)}.${LIST}`)
    .filter(filter)
    .map(
      (account: IAccount): IAccount => {
        return update(
          "privateKey",
          Buffer.from,
          update("publicKey", Buffer.from, account)
        );
      }
    )
    .value();
};

export const getAccount = async (
  name: string,
  id: number
): Promise<IAccount | undefined> => {
  return (await db())
    .get(`${getKey(name)}.${LIST}`)
    .find({ id })
    .value() as IAccount | undefined;
};
