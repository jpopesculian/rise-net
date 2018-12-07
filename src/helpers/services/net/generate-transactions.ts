import { Rise } from "dpos-offline";
import { filter, isString, map, merge, update } from "lodash/fp";

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
  const tx = Rise.txs.transform(
    addExtraFields(
      { kind: "send", amount, recipient: recipient.address },
      sender
    )
  );
  return normalizeTx(Rise.txs.sign(tx, sender.passphrase));
};

const generateDelegateTransaction = (account: IAccount) => {
  const tx = Rise.txs.transform(
    addExtraFields(
      {
        kind: "register-delegate",
        identifier: account.username
      },
      account
    )
  );
  return normalizeTx(Rise.txs.sign(tx, account.passphrase));
};

const generateVoteTransaction = (account: IAccount) => {
  const tx = Rise.txs.transform(
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
    )
  );
  tx.recipientId = account.address;
  return normalizeTx(Rise.txs.sign(tx, account.passphrase));
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
  genesisAccount: IAccount,
  accounts: IAccount[],
  totalAmount: number
) => {
  return [
    ...generateSendTransactions(
      genesisAccount,
      accounts,
      totalAmount / accounts.length
    ),
    ...generateDelegateTransactions(accounts),
    ...generateVoteTransactions(accounts)
  ];
};
