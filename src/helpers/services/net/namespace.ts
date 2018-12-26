import { curry } from "lodash/fp";

import { getAccount } from "../../../db/accounts/list";
import { ITestNetConfig } from "../../types/testnet-config";
import { DELEGATE, GENESIS, typeString, USER } from "../accounts/account-type";

export const networkNamed = async (testnet: ITestNetConfig) => {
  const account = await getAccount(testnet.accountsListId, testnet.delegateId);
  const typeStr = account ? typeString(account) : "undefined";
  return [testnet.netName, typeStr, testnet.delegateId].join("-");
};

export const isNetworkNamed = curry(
  (label: string, node: string): boolean => {
    const re = new RegExp(`${label}-(${DELEGATE}|${GENESIS}|${USER})-[0-9]+`);
    return re.test(node);
  }
);
