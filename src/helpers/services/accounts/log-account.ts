import chalk from "chalk";

import { isDelegate, isGenesis } from "../../services/accounts/account-type";
import { IAccount } from "../../types/accounts";
import { ILogger } from "../../types/logger";

export const logAccount = (logger: ILogger, account: IAccount) => {
  let userType = "normal";
  switch (true) {
    case isGenesis(account):
      userType = "genesis";
      break;
    case isDelegate(account):
      userType = "delegate";
  }
  logger(`${chalk.bold("Type")}:\t\t${userType}`);
  logger(`${chalk.bold("ID")}:\t\t${account.id}`);
  logger(`${chalk.bold("Address")}:\t${account.address}`);
  logger(`${chalk.bold("Public Key")}:\t${account.publicKey.toString("hex")}`);
  logger(
    `${chalk.bold("Private Key")}:\t${account.privateKey.toString("hex")}`
  );
  logger(`${chalk.bold("Passphrase")}:\t${account.passphrase}`);
  if (userType === "delegate") {
    logger(`${chalk.bold("Username")}:\t${account.username}`);
  }
  logger();
};
