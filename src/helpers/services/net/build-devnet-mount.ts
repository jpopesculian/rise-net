import * as path from "path";

import { getAccount } from "../../../db/accounts/list";
import { setNetwork } from "../../../db/node/network";
import { ITestNetConfig } from "../../types/testnet-config";

import { networkNamed } from "./namespace";
import { peerListFromNetwork } from "./peer-list-from-network";

export const buildDevnetMount = async (testnetConfig: ITestNetConfig) => {
  const { netName, accountsListId, delegateId } = testnetConfig;
  const config = require(path.join(
    __dirname,
    "../../../../assets/config/devnet/config.json"
  ));
  const account = getAccount(accountsListId, delegateId);
  if (account) {
    config.forging.secret = [account.passphrase];
  }
  config.peers.list = await peerListFromNetwork(netName);
  console.log(JSON.stringify(config, null, 4));
  setNetwork(networkNamed(testnetConfig), netName);
  return "";
};
