import { filter, find, isEmpty } from "lodash/fp";

import { getAccounts } from "../../db/accounts/list";
import { setGenesis } from "../../db/net/genesis";
import { TOTAL_AMOUNT } from "../../helpers/constants/net/default-config";
import { isGenesis } from "../../helpers/services/accounts/account-type";
import { generateGenesisBlock } from "../../helpers/services/net/generate-genesis-block";
import { generateTransactions } from "../../helpers/services/net/generate-transactions";
import { IAccount } from "../../helpers/types/accounts";
import { ICommandFlags } from "../../helpers/types/command-flags";
import { createAccounts } from "../accounts/create";

interface IForgeGensisFlags extends ICommandFlags {
  totalAmount?: number;
}

export const forgeGenesis = async (
  id: string,
  { totalAmount = TOTAL_AMOUNT }: IForgeGensisFlags
): Promise<any> => {
  let accounts = await getAccounts(id);
  if (isEmpty(accounts)) {
    await createAccounts(id, {});
    accounts = await getAccounts(id);
  }
  const genesisAccount = find(acc => isGenesis(acc), accounts) as IAccount;
  const otherAccounts = filter(acc => !isGenesis(acc), accounts);
  const transactions = generateTransactions(
    genesisAccount,
    otherAccounts,
    totalAmount
  );
  const genesisBlock = await generateGenesisBlock(transactions, genesisAccount);
  setGenesis(id, genesisBlock);
  return genesisBlock;
};
