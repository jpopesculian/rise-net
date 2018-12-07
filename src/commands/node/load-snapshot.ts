import { Command, flags } from "@oclif/command";

import {
  LATEST_VERSION,
  stripLatestVersion
} from "../../helpers/commands/node/version";
import { NETWORK } from "../../helpers/constants/node/default-config";
import { loadSnapshot } from "../../services/node/load-snapshot";

export default class NodeLoadSnapshot extends Command {
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
      default: LATEST_VERSION
    })
  };

  async run() {
    const { flags } = this.parse(NodeLoadSnapshot);
    const { version, ...restFlags } = flags;
    await loadSnapshot({
      ...restFlags,
      version: stripLatestVersion(version)
    });
  }
}
