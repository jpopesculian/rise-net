import chalk from "chalk";
import { map, partial } from "lodash/fp";

import { getList } from "../../db/accounts/list";
import { dummyLogger } from "../../helpers/logger";
import {
  isDelegate,
  isGenesis
} from "../../helpers/services/accounts/account-type";
import { IAccount } from "../../helpers/types/accounts";
import { ICommandFlags } from "../../helpers/types/command-flags";
import { ILogger } from "../../helpers/types/logger";

const logAccount = (logger: ILogger, account: IAccount) => {
  let userType = "normal";
  switch (true) {
    case isGenesis(account):
      userType = "genesis";
      break;
    case isDelegate(account):
      userType = "delegate";
  }
  logger(`${chalk.bold("Type")}:\t\t${userType}`);
  logger(`${chalk.bold("Address")}:\t${account.address}`);
  logger(`${chalk.bold("Public Key")}:\t${account.publicKey.toString("hex")}`);
  logger(
    `${chalk.bold("Private Key")}:\t${account.privateKey.toString("hex")}`
  );
  if (userType === "delegate") {
    logger(`${chalk.bold("Username")}:\t${account.username}`);
  }
  logger();
};

export const listAccounts = async (
  id: string,
  {
    delegatesOnly,
    logger = dummyLogger
  }: { delegatesOnly?: boolean } & ICommandFlags
): Promise<void> => {
  const filter = delegatesOnly ? isDelegate : { genesis: false };
  map(partial(logAccount, [logger]), getList(id, filter));
};
