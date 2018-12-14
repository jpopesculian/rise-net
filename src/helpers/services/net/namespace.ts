import { getAccount } from "../../../db/accounts/list";
import { ITestNetConfig } from "../../types/testnet-config";
import { typeString } from "../accounts/account-type";

export const networkNamed = async (testnet: ITestNetConfig) => {
  const account = await getAccount(testnet.accountsListId, testnet.delegateId);
  const typeStr = account ? typeString(account) : "undefined";
  return [testnet.netName, typeStr, testnet.delegateId].join("-");
};
