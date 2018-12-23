import { getAccounts } from "../../db/accounts/list";
import { getGenesis } from "../../db/net/genesis";
import { ID } from "../../helpers/constants/accounts/default-config";
import { ICommandFlags } from "../../helpers/types/command-flags";

interface IStartNetFlags extends ICommandFlags {
  id: string;
  num: number;
}

export const startNet = async (
  label: string,
  { id = ID, num }: IStartNetFlags
) => {
  const genesisBlock = await getGenesis(id);
  num = num || (await getAccounts(id, {})).length;
};
