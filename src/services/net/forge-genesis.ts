import {
  generateTransactions
} from "../../helpers/services/net/generate-transactions";
import { getList } from "../../db/accounts/list";

export const forgeGenesis = async (id: string): Promise<void> => {
  const transactions = generateTransactions(getList(id), 1000000);
  console.log(transactions);
};
