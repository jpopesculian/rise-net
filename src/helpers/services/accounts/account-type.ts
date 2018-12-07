import { isEmpty } from "lodash/fp";

import { IAccount } from "../../types/accounts";

export const isGenesis = (account: IAccount) => account.genesis;

export const isDelegate = (account: IAccount) =>
  !isGenesis(account) && !isEmpty(account.username);

export const isNormal = (account: IAccount) =>
  !isDelegate(account) && !isGenesis(account);
