import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

import { ID } from "../../helpers/constants/accounts/default-config";
import { TOTAL_AMOUNT } from "../../helpers/constants/net/default-config";
import { forgeGenesis } from "../../services/net/forge-genesis";

export default class AccountsCreate extends Command {
  static description = "Create a list of accounts";

  static flags = {
    help: flags.help({ char: "h" }),
    id: flags.string({
      char: "i",
      description: "Id of the accounts list for reference",
      default: ID
    }),
    totalAmount: flags.integer({
      char: "t",
      description: "Total amount of RISE to split among users",
      default: TOTAL_AMOUNT
    })
  };

  async run() {
    const { flags } = this.parse(AccountsCreate);
    const { id, ...restFlags } = flags;
    cli.action.start(`Generating genesis block: ${id}`);
    const genesisBlock = await forgeGenesis(id || ID, restFlags);
    this.log(genesisBlock);
    cli.action.stop();
  }
}
