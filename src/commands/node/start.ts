import { Command, flags } from "@oclif/command";

import {
  ID,
  NETWORK,
  PORT,
  VERSION
} from "../../helpers/constants/node/default-config";
import { startNode } from "../../services/node/start";

export default class NodeStart extends Command {
  static description = "Starts a Rise Node";

  static flags = {
    help: flags.help({ char: "h" }),
    port: flags.integer({ char: "p", description: "API port", default: PORT }),
    configFile: flags.string({
      char: "c",
      description: "path of node configuration file"
    }),
    network: flags.string({
      char: "n",
      description: "Network",
      default: NETWORK
    }),
    id: flags.string({
      char: "i",
      description: "An identifier for the running node",
      default: ID
    }),
    version: flags.string({
      char: "v",
      description: "Version to build",
      default: VERSION
    })
  };

  async run() {
    const { flags } = this.parse(NodeStart);
    const { id, ...restFlags } = flags;
    await startNode(id || ID, restFlags);
  }
}
