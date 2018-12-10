import { Command, flags } from "@oclif/command";

import {
  LATEST_VERSION,
  stripLatestVersion
} from "../../helpers/commands/node/version";
import { ID, NETWORK, PORT } from "../../helpers/constants/node/default-config";
import { scriptNode } from "../../services/node/script";

export default class NodeScript extends Command {
  static description = "Run a Node.js script in a container";

  static flags = {
    help: flags.help({ char: "h" }),
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
    src: flags.string({
      char: "s",
      description: "Directory of node src to mount"
    }),
    args: flags.string({
      char: "a",
      description: "Arguments to give node script"
    }),
    out: flags.string({
      char: "o",
      description: "Save output to file"
    }),
    assets: flags.string({
      char: "s",
      description: 'Assets to bind to node (located at "./.scripts/assets")'
    })
  };

  static args = [{ name: "FILE", required: true }];

  async run() {
    const { flags, args } = this.parse(NodeScript);
    const { id, version, ...restFlags } = flags;
    await scriptNode(args.FILE, id || ID, {
      ...restFlags,
      version: stripLatestVersion(version)
    });
  }
}
