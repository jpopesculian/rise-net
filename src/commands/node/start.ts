import { Command, flags } from "@oclif/command";

import { startNode } from "../../services/node/start";

export default class NodeStart extends Command {
  static description = "Starts a Rise Node";

  static flags = {
    help: flags.help({ char: "h" }),
    port: flags.integer({ char: "p", description: "API port", default: 5555 }),
    configFile: flags.string({
      char: "c",
      description: "path of node configuration file"
    }),
    network: flags.string({
      char: "n",
      description: "Network",
      default: "mainnet"
    }),
    id: flags.string({
      char: "i",
      description: "An identifier for the running node",
      default: "main"
    })
  };

  async run() {
    const { flags } = this.parse(NodeStart);
    const { id, ...restFlags } = flags;
    await startNode(id || "main", {
      ...restFlags,
      logger: this.log.bind(this)
    });
  }
}
