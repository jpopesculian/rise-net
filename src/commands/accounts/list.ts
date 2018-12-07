import { Command, flags } from "@oclif/command";

import { ID } from "../../helpers/constants/accounts/default-config";
import { listAccounts } from "../../services/accounts/list";

export default class AccountsList extends Command {
  static description = "List accounts created";

  static flags = {
    help: flags.help({ char: "h" }),
    id: flags.string({
      char: "i",
      description: "Id of the accounts list for reference",
      default: ID
    }),
    delegatesOnly: flags.boolean({
      char: "d",
      description: "Delegates only",
      default: false
    })
  };

  async run() {
    const { flags } = this.parse(AccountsList);
    const { id, ...restFlags } = flags;
    await listAccounts(id || ID, { ...restFlags, logger: this.log });
  }
}
