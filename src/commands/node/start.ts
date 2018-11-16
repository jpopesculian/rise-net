import { Command, flags } from "@oclif/command";

import { startNode } from "../../services/node/start";

export default class NodeStart extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
    port: flags.integer({ char: "p", description: "API port", default: 5555 })
  };

  static args = [{ name: "file" }];

  async run() {
    const { flags } = this.parse(NodeStart);
    await startNode({
      ...flags,
      logger: this.log.bind(this)
    });
  }
}
