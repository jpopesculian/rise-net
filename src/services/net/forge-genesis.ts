import { filter, find, isEmpty } from "lodash/fp";

import { getList } from "../../db/accounts/list";
import { TOTAL_AMOUNT } from "../../helpers/constants/net/default-config";
import { isGenesis } from "../../helpers/services/accounts/account-type";
import {
  generateGenesisBlock
} from "../../helpers/services/net/generate-genesis-block";
import {
  generateTransactions
} from "../../helpers/services/net/generate-transactions";
import { IAccount } from "../../helpers/types/accounts";
import { ICommandFlags } from "../../helpers/types/command-flags";
import { createAccounts } from "../accounts/create";

interface IForgeGensisFlags extends ICommandFlags {
  totalAmount?: number
}

export const forgeGenesis = async (
  id: string,
  { totalAmount = TOTAL_AMOUNT }: IForgeGensisFlags
): Promise<string> => {
  let accounts = getList(id);
  if (isEmpty(accounts)) {
    await createAccounts(id, {});
    accounts = getList(id);
  }
  const genesisAccount = find(acc => isGenesis(acc), accounts) as IAccount;
  const otherAccounts = filter(acc => !isGenesis(acc), accounts);
  const transactions = generateTransactions(
    genesisAccount,
    otherAccounts,
    totalAmount
  );
  return generateGenesisBlock(transactions, genesisAccount);
};
