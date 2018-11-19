import { Command, flags } from "@oclif/command";

import { NETWORK } from "../../helpers/constants/node/default-config";
import { loadSnapshot } from "../../services/node/load-snapshot";

export default class NodeBuild extends Command {
  static description = "Build node image";

  static flags = {
    help: flags.help({ char: "h" }),
    network: flags.string({
      char: "n",
      description: "Network",
      default: NETWORK
    })
  };

  async run() {
    const { flags } = this.parse(NodeBuild);
    await loadSnapshot(flags.network || NETWORK);
  }
}
