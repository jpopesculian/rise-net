import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

import { ID } from "../../helpers/constants/node/default-config";
import { pruneNodes } from "../../services/node/prune";
import { resetNode } from "../../services/node/reset";

export default class NodeReset extends Command {
  static description = "Reset data for a node";

  static flags = {
    help: flags.help({ char: "h" }),
    id: flags.string({
      char: "i",
      description: "An identifier for the stopped node",
      default: ID
    }),
    all: flags.boolean({
      char: "a",
      description: "Reset all non-running nodes"
    })
  };

  async run() {
    const { flags } = this.parse(NodeReset);
    if (flags.all) {
      cli.action.start(`Pruning nodes`);
      await pruneNodes();
    } else {
      cli.action.start("Removing data and log volumes");
      await resetNode(flags.id || ID, this.log);
    }
    cli.action.stop();
  }
}
