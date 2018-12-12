import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

import { pruneNodes } from "../../services/node/prune";

export default class NodePrune extends Command {
  static description = "Reset all stopped nodes";

  static flags = {
    help: flags.help({ char: "h" })
  };

  async run() {
    cli.action.start(`Pruning nodes`);
    await pruneNodes();
    cli.action.stop();
  }
}
