import { map, partial } from "lodash/fp";

import { getList } from "../../db/accounts/list";
import { dummyLogger } from "../../helpers/logger";
import { isDelegate } from "../../helpers/services/accounts/account-type";
import { logAccount } from "../../helpers/services/accounts/log-account";
import { ICommandFlags } from "../../helpers/types/command-flags";

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
