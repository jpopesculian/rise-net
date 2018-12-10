import { Command, flags } from "@oclif/command";

import { getGenesis } from "../../db/net/genesis";
import { ID } from "../../helpers/constants/accounts/default-config";

export default class GetGenesis extends Command {
  static description = "Create a genesis block";

  static flags = {
    help: flags.help({ char: "h" }),
    id: flags.string({
      char: "i",
      default: ID,
      description: "Id of the accounts list for reference"
    })
  };

  async run() {
    const { flags } = this.parse(GetGenesis);
    const { id } = flags;
    const genesisBlock = getGenesis(id || ID);
    if (genesisBlock) {
      this.log(JSON.stringify(genesisBlock, null, 4));
    } else {
      this.log(`No genesis block found for: ${id}`);
    }
  }
}
