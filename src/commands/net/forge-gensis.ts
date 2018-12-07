import { Command, flags } from "@oclif/command";

import { ID } from "../../helpers/constants/accounts/default-config";
import { forgeGenesis } from "../../services/net/forge-genesis";

export default class AccountsCreate extends Command {
  static description = "Create a list of accounts";

  static flags = {
    help: flags.help({ char: "h" }),
    id: flags.string({
      char: "i",
      description: "Id of the accounts list for reference",
      default: ID
    })
  };

  async run() {
    const { flags } = this.parse(AccountsCreate);
    const { id } = flags;
    await forgeGenesis(id || ID);
  }
}
