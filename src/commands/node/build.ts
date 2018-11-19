import { Command, flags } from "@oclif/command";

import { VERSION } from "../../helpers/constants/node/default-config";
import { buildNode } from "../../services/node/build";

export default class NodeBuild extends Command {
  static description = "Build node image";

  static flags = {
    help: flags.help({ char: "h" }),
    version: flags.string({
      char: "v",
      description: "Version to build",
      default: VERSION
    })
  };

  async run() {
    const { flags } = this.parse(NodeBuild);
    await buildNode(flags.version || VERSION);
  }
}
