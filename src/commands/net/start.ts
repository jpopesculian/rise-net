import { Command, flags } from "@oclif/command";

import { hasGenesis } from "../../db/net/genesis";
import { ID } from "../../helpers/constants/accounts/default-config";
import { LABEL } from "../../helpers/constants/net/default-config";

export default class StartNet extends Command {
  static description = "Start a dev network of `n` nodes";

  static flags = {
    help: flags.help({ char: "h" }),
    label: flags.string({
      char: "l",
      description: "Label for the dev network",
      default: LABEL
    }),
    num: flags.integer({
      char: "n",
      description:
        "[default: # of delegates] Number of nodes to generate for the dev network"
    }),
    id: flags.string({
      char: "i",
      default: ID,
      description: "Id of the accounts list used to generate a genesis block"
    })
  };

  async run() {
    const { flags } = this.parse(StartNet);
    const { id = ID } = flags;
    if (await hasGenesis(id)) {
      console.log("Genesis block detected");
    } else {
      this.log(`No genesis block found for: ${id}`);
    }
  }
}
