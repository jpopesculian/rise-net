import { Address } from "dpos-offline";
import { As } from "type-tagger";

export interface IAccount {
  id: number,
  passphrase: string,
  address: Address,
  privateKey: Buffer & As<"privateKey">,
  publicKey: Buffer & As<"publicKey">,
  username?: string,
  genesis?: boolean
}
