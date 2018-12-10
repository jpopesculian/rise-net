import { generateMnemonic } from "bip39";
import { Rise } from "dpos-offline";
import { castArray, isNumber, map, range, set, zipWith } from "lodash/fp";

import { IAccount } from "../../types/accounts";

const generateAccount = (id: number): IAccount => {
  const passphrase = generateMnemonic();
  const { privateKey, publicKey } = Rise.deriveKeypair(passphrase);
  const address = Rise.calcAddress(publicKey);
  return { id, passphrase, address, privateKey, publicKey, genesis: false };
};

const generateAccounts = (num: number): IAccount[] => {
  return map(generateAccount, range(0, num));
};

const addUsernames = (
  accounts: IAccount[],
  delegateNum: number
): IAccount[] => {
  if (delegateNum > accounts.length) {
    throw new Error(
      "Delegate amount cannot be greater than total amount of accounts"
    );
  }
  return zipWith(
    (id, account): IAccount => {
      return isNumber(id) ? set("username", `delegate${id}`, account) : account;
    },
    castArray(range(1, delegateNum + 1)),
    accounts
  );
};

export const buildAccountsList = (totalNum: number, delegateNum?: number) => {
  delegateNum = isNumber(delegateNum) ? delegateNum : totalNum;
  const [genesisAccount, ...accounts] = generateAccounts(totalNum + 1);
  return [
    set("genesis", true, genesisAccount),
    ...addUsernames(accounts, delegateNum)
  ];
};
