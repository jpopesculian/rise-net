import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

import { ID } from "../../helpers/constants/node/default-config";
import { stopNode } from "../../services/node/stop";

export default class NodeStop extends Command {
  static description = "Stop a running node";

  static flags = {
    help: flags.help({ char: "h" }),
    name: flags.string({
      char: "n",
      description: "Name of node",
      default: ID
    })
  };

  async run() {
    const { flags } = this.parse(NodeStop);
    cli.action.start(`Stopping node: ${flags.name}`);
    try {
      await stopNode(flags.name || ID);
    } catch (e) {
      this.log(e);
    }
    cli.action.stop();
  }
}
