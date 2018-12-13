import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

import { ID } from "../../helpers/constants/node/default-config";
import { stopNode } from "../../services/node/stop";
import { stopAllNodes } from "../../services/node/stop-all";

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
    }),
    all: flags.boolean({
      char: "a",
      description: "Stop all running nodes"
    })
  };

  async run() {
    const { flags } = this.parse(NodeStop);
    const { id, all, ...restFlags } = flags;
    const opts = { ...restFlags, logger: this.log };
    cli.action.start(all ? "Stopping all nodes" : `Stopping node: ${id}`);
    try {
      await (all ? stopAllNodes(opts) : stopNode(id || ID, opts));
    } catch (e) {
      this.log(e);
    }
    cli.action.stop();
  }
}
