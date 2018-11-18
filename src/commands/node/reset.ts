import { Command, flags } from "@oclif/command";

import { resetNode } from "../../services/node/reset";

export default class NodeReset extends Command {
  static description = "Reset data for a node";

  static flags = {
    help: flags.help({ char: "h" }),
    id: flags.string({
      char: "i",
      description: "An identifier for the running node",
      default: "main"
    })
  };

  async run() {
    const { flags } = this.parse(NodeReset);
    await resetNode(flags.id || "main");
  }
}
