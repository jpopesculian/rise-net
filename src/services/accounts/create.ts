import { setList } from "../../db/accounts/list";
import { ACCOUNT_NUM } from "../../helpers/constants/accounts/default-config";
import { buildAccountsList } from "../../helpers/services/accounts/build-list";
import { ICommandFlags } from "../../helpers/types/command-flags";

interface IUtilsCreateAccountsFlags extends ICommandFlags {
  id?: string,
  totalNum?: number,
  delegateNum?: number
}

export const createAccounts = async (
  id: string,
  {
    totalNum = ACCOUNT_NUM,
    delegateNum = ACCOUNT_NUM
  }: IUtilsCreateAccountsFlags
): Promise<void> => {
  setList(id, buildAccountsList(totalNum, delegateNum));
};
