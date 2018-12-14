import { setAccounts } from "../../db/accounts/list";
import { setGenesis } from "../../db/net/genesis";
import { ACCOUNT_NUM } from "../../helpers/constants/accounts/default-config";
import { buildAccountsList } from "../../helpers/services/accounts/build-list";
import { ICommandFlags } from "../../helpers/types/command-flags";

interface IUtilsCreateAccountsFlags extends ICommandFlags {
  id?: string;
  totalNum?: number;
  delegateNum?: number;
}

export const createAccounts = async (
  id: string,
  {
    totalNum = ACCOUNT_NUM,
    delegateNum = ACCOUNT_NUM
  }: IUtilsCreateAccountsFlags
): Promise<void> => {
  await setAccounts(id, buildAccountsList(totalNum, delegateNum));
  await setGenesis(id, {});
};
