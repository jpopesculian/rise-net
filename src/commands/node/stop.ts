import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

import { ID } from "../../helpers/constants/node/default-config";
import { stopNode } from "../../services/node/stop";

export default class NodeStop extends Command {
  static description = "Stop a running node";

  static flags = {
    help: flags.help({ char: "h" }),
    id: flags.string({
      char: "i",
      description: "The identifier for the running node",
      default: ID
    }),
    remove: flags.boolean({
      char: "r",
      description: "Remove data and logs for container once stopped"
    })
  };

  async run() {
    const { flags } = this.parse(NodeStop);
    const { id, ...restFlags } = flags;
    cli.action.start(`Stopping node: ${id}`);
    try {
      await stopNode(id || ID, restFlags);
    } catch (e) {
      this.log(e);
    }
    cli.action.stop();
  }
}
