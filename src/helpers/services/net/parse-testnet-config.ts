import { isEmpty, isNumber } from "lodash/fp";

import { getAccounts } from "../../../db/accounts/list";
import { getGenesis } from "../../../db/net/genesis";
import { ITestNetConfig } from "../../types/testnet-config";

export class TestNetConfigError extends Error {
  constructor(configString: string) {
    super(`Test net config (${configString}) is invalid`);
  }
}

const validDevnetConfig = async ({
  netName,
  accountsListId,
  delegateId
}: ITestNetConfig) => {
  return (
    !isEmpty(netName) &&
    !isEmpty(await getAccounts(accountsListId)) &&
    !isEmpty(await getGenesis(accountsListId)) &&
    isNumber(delegateId)
  );
};

export const parseTestnetConfig = (configString = ""): ITestNetConfig => {
  const parts = configString.split(":");
  if (parts.length !== 3) {
    throw new TestNetConfigError(configString);
  }
  const config = {
    netName: parts[0],
    accountsListId: parts[1],
    delegateId: parseInt(parts[2], 10)
  };
  if (!validDevnetConfig(config)) {
    throw new TestNetConfigError(configString);
  }
  return config;
};
