import { Command, flags } from "@oclif/command";

import {
  ACCOUNT_NUM,
  ID
} from "../../helpers/constants/accounts/default-config";
import { createAccounts } from "../../services/accounts/create";

export default class AccountsCreate extends Command {
  static description = "Create a list of accounts";

  static flags = {
    help: flags.help({ char: "h" }),
    id: flags.string({
      char: "i",
      description: "Id of the accounts list for reference",
      default: ID
    }),
    totalNum: flags.integer({
      char: "n",
      description: "Total number of accounts",
      default: ACCOUNT_NUM
    }),
    delegateNum: flags.integer({
      char: "d",
      description: "Total number of delegates",
      default: ACCOUNT_NUM
    })
  };

  async run() {
    const { flags } = this.parse(AccountsCreate);
    const { id, ...restFlags } = flags;
    await createAccounts(id || ID, { ...restFlags, logger: this.log });
  }
}
