import { Command, flags } from "@oclif/command";

import { ID, NETWORK, PORT } from "../../helpers/constants/node/default-config";
import { startNode } from "../../services/node/start";

const LATEST = "latest";

export default class NodeStart extends Command {
  static description = "Start a RISE Node";

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
      default: LATEST
    }),
    watch: flags.boolean({
      char: "w",
      description: "Watch src changes"
    }),
    src: flags.string({
      char: "s",
      description: "Directory of node src to mount"
    })
  };

  async run() {
    const { flags } = this.parse(NodeStart);
    const { id, version, ...restFlags } = flags;
    await startNode(id || ID, {
      ...restFlags,
      version: version === LATEST ? undefined : version
    });
  }
}
