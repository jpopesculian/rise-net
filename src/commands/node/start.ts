import { Command, flags } from "@oclif/command";

import {
  LATEST_VERSION,
  stripLatestVersion
} from "../../helpers/commands/node/version";
import { ID, NETWORK, PORT } from "../../helpers/constants/node/default-config";
import { startNode } from "../../services/node/start";

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
      default: LATEST_VERSION
    }),
    watch: flags.boolean({
      char: "w",
      description: "Watch src changes"
    }),
    src: flags.string({
      char: "s",
      description: "Directory of node src to mount"
    }),
    entry: flags.string({
      char: "e",
      description: "Node entry for pm2"
    }),
    daemon: flags.boolean({
      char: "d",
      description: "Start node as daemon"
    })
  };

  async run() {
    const { flags } = this.parse(NodeStart);
    const { id, version, ...restFlags } = flags;
    await startNode(id || ID, {
      ...restFlags,
      version: stripLatestVersion(version)
    });
  }
}
