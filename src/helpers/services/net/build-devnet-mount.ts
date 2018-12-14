import { writeFileSync } from "fs";
import * as path from "path";
import * as tmp from "tmp-promise";

import { getAccount } from "../../../db/accounts/list";
import { getGenesis } from "../../../db/net/genesis";
import { setNetwork } from "../../../db/node/network";
import { DEVNET } from "../../constants/node/paths";
import { ITestNetConfig } from "../../types/testnet-config";

import { networkNamed } from "./namespace";
import { peerListFromNetwork } from "./peer-list-from-network";

const buildConfigJson = async ({
  netName,
  accountsListId,
  delegateId
}: ITestNetConfig) => {
  const config = require(path.join(
    __dirname,
    "../../../../assets/config/devnet/config.json"
  ));
  const account = await getAccount(accountsListId, delegateId);
  if (account) {
    config.forging.secret = [account.passphrase];
  }
  config.peers.list = await peerListFromNetwork(netName);
  return config;
};

export const buildDevnetMount = async (
  testnet: ITestNetConfig,
  preserve: boolean
) => {
  const tmpDir = (await tmp.dir({
    mode: 0o777,
    prefix: "rise_devnet_",
    unsafeCleanup: !preserve
  })).path;
  writeFileSync(
    path.join(tmpDir, "config.json"),
    JSON.stringify(await buildConfigJson(testnet))
  );
  writeFileSync(
    path.join(tmpDir, "genesisBlock.json"),
    JSON.stringify(await getGenesis(testnet.accountsListId))
  );
  await setNetwork(await networkNamed(testnet), testnet.netName);
  return `--mount "type=bind,src=${tmpDir},dst=${DEVNET}"`;
};
