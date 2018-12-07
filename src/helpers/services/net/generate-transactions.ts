import { Rise } from "dpos-offline";
import { filter, find, isString, map, merge, update } from "lodash/fp";

import { IAccount } from "../../types/accounts";
import { isDelegate } from "../accounts/account-type";

const normalizeTx = (tx: any) => {
  if (isString(tx.fee)) {
    tx = update("fee", parseInt, tx);
  }
  if (isString(tx.amount)) {
    tx = update("amount", parseInt, tx);
  }
  return tx;
};

const addExtraFields = (txParams: any, sender: IAccount): any => {
  return merge(txParams, {
    nonce: "0",
    fee: "0",
    sender: {
      publicKey: sender.publicKey,
      address: sender.address
    }
  });
};

const generateSendTransaction = (
  sender: IAccount,
  recipient: IAccount,
  amount: number
) => {
  return normalizeTx(
    Rise.txs.createAndSign(
      addExtraFields(
        {
          kind: "send",
          amount,
          recipient: recipient.address
        },
        sender
      ),
      sender.passphrase
    )
  );
};

const generateDelegateTransaction = (account: IAccount) => {
  return normalizeTx(
    Rise.txs.createAndSign(
      addExtraFields(
        {
          kind: "register-delegate",
          identifier: account.username
        },
        account
      ),
      account.passphrase
    )
  );
};

const generateVoteTransaction = (account: IAccount) => {
  return normalizeTx(
    Rise.txs.createAndSign(
      addExtraFields(
        {
          kind: "vote",
          preferences: [
            {
              delegateIdentifier: account.publicKey,
              action: "+"
            }
          ]
        },
        account
      ),
      account.passphrase
    )
  );
};

const generateSendTransactions = (
  sender: IAccount,
  recipients: IAccount[],
  amount: number
) => {
  return map(
    recipient => generateSendTransaction(sender, recipient, amount),
    recipients
  );
};

const generateDelegateTransactions = (accounts: IAccount[]) => {
  return map(
    account => generateDelegateTransaction(account),
    filter(isDelegate, accounts)
  );
};

const generateVoteTransactions = (accounts: IAccount[]) => {
  return map(
    account => generateVoteTransaction(account),
    filter(isDelegate, accounts)
  );
};

export const generateTransactions = (
  accounts: IAccount[],
  totalAmount: number
) => {
  const genesisAccount = find({ genesis: true }, accounts) || accounts[0];
  const otherAccounts = filter({ genesis: false }, accounts);
  return [
    ...generateSendTransactions(
      genesisAccount,
      otherAccounts,
      totalAmount / otherAccounts.length
    ),
    ...generateDelegateTransactions(otherAccounts),
    ...generateVoteTransactions(otherAccounts)
  ];
};
