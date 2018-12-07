import { Command, flags } from "@oclif/command";

import { ID } from "../../helpers/constants/node/default-config";
import { attachNode } from "../../services/node/attach";

export default class NodeAttach extends Command {
  static description = "Attach a RISE Node";

  static flags = {
    help: flags.help({ char: "h" }),
    id: flags.string({
      char: "i",
      description: "An identifier for the running node",
      default: ID
    })
  };

  async run() {
    const { flags } = this.parse(NodeAttach);
    await attachNode(flags.id || ID);
  }
}
