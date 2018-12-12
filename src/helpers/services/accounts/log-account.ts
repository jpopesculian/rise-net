import chalk from "chalk";

import { isDelegate, typeString } from "../../services/accounts/account-type";
import { IAccount } from "../../types/accounts";
import { ILogger } from "../../types/logger";

export const logAccount = (logger: ILogger, account: IAccount) => {
  logger(`${chalk.bold("Type")}:\t\t${typeString(account)}`);
  logger(`${chalk.bold("ID")}:\t\t${account.id}`);
  logger(`${chalk.bold("Address")}:\t${account.address}`);
  logger(`${chalk.bold("Public Key")}:\t${account.publicKey.toString("hex")}`);
  logger(
    `${chalk.bold("Private Key")}:\t${account.privateKey.toString("hex")}`
  );
  logger(`${chalk.bold("Passphrase")}:\t${account.passphrase}`);
  if (isDelegate(account)) {
    logger(`${chalk.bold("Username")}:\t${account.username}`);
  }
  logger();
};
