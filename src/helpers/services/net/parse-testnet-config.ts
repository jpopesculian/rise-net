import { isEmpty, isNumber } from "lodash/fp";

import { getList } from "../../../db/accounts/list";
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
    !isEmpty(getList(accountsListId)) &&
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
