import { Command, flags } from "@oclif/command";

import { NETWORK } from "../../helpers/constants/node/default-config";
import { loadSnapshot } from "../../services/node/load-snapshot";

const LATEST = "latest";

export default class NodeBuild extends Command {
  static description = "Load a snapshot of the blockchain";

  static flags = {
    help: flags.help({ char: "h" }),
    network: flags.string({
      char: "n",
      description: "Network",
      default: NETWORK
    }),
    file: flags.string({
      char: "f",
      description: "Snapshot file (otherwise will be downloaded)"
    }),
    version: flags.string({
      char: "v",
      description: "Version to build",
      default: LATEST
    })
  };

  async run() {
    const { flags } = this.parse(NodeBuild);
    const { version, ...restFlags } = flags;
    await loadSnapshot({
      ...restFlags,
      version: version === LATEST ? undefined : version
    });
  }
}
