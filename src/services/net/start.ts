import { EventEmitter } from "events";
import { map, max, range, sample } from "lodash/fp";

import { getAccounts } from "../../db/accounts/list";
import { ID } from "../../helpers/constants/accounts/default-config";
import { PORT_START } from "../../helpers/constants/net/default-config";
import { dummyLogger } from "../../helpers/logger";
import {
  isDelegate,
  isNormal
} from "../../helpers/services/accounts/account-type";
import { IStartCommandFlags } from "../../helpers/types/start-command-flags";
import { startNode } from "../node/start";

interface IStartNetFlags extends IStartCommandFlags {
  id?: string;
  num?: number;
  portStart?: number;
}

export const startNet = async (
  label: string,
  {
    id = ID,
    portStart = PORT_START,
    num,
    logger = dummyLogger,
    ...restFlags
  }: IStartNetFlags
) => {
  EventEmitter.defaultMaxListeners = 0;
  const userAccountRange = map("id", await getAccounts(id, isNormal));
  const maxAccountId = max(map("id", await getAccounts(id)));
  num = num || (await getAccounts(id, isDelegate)).length;
  const configs = map(accountNum => {
    const port = portStart + accountNum;
    const accountId =
      accountNum >= (maxAccountId || 0)
        ? sample(userAccountRange) || 1
        : accountNum + 1;
    return {
      ...restFlags,
      num: accountNum,
      port,
      testnet: {
        netName: label,
        accountsListId: id,
        delegateId: accountId
      },
      daemon: true
    };
  }, range(0, num));
  for (const { num, ...config } of configs) {
    await startNode(label, config);
    logger(`${label} node #${num} started successfully!`);
  }
};
