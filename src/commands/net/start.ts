import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

import { hasGenesis } from "../../db/net/genesis";
import {
  LATEST_VERSION,
  stripLatestVersion
} from "../../helpers/commands/node/version";
import { ID } from "../../helpers/constants/accounts/default-config";
import { LABEL, PORT_START } from "../../helpers/constants/net/default-config";
import { startNet } from "../../services/net/start";

export default class StartNet extends Command {
  static description = "Start a dev network of `n` nodes";

  static flags = {
    help: flags.help({ char: "h" }),
    label: flags.string({
      char: "l",
      description: "Label for the dev network",
      default: LABEL
    }),
    num: flags.integer({
      char: "n",
      description:
        "[default: # of delegates] Number of nodes to generate for the dev network"
    }),
    id: flags.string({
      char: "i",
      default: ID,
      description: "Id of the accounts list used to generate a genesis block"
    }),
    portStart: flags.integer({
      char: "p",
      default: PORT_START,
      description: "Port number to start at for port range"
    }),
    configFile: flags.string({
      char: "c",
      description: "path of node configuration file"
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
    })
  };

  async run() {
    const { flags } = this.parse(StartNet);
    const { label = LABEL, id = ID, version, ...restFlags } = flags;
    if (await hasGenesis(id)) {
      cli.action.start(`Starting network: ${label}`);
      await startNet(label, {
        ...restFlags,
        id,
        logger: this.log,
        version: stripLatestVersion(version)
      });
      cli.action.stop();
    } else {
      this.log(`No genesis block found for: ${id}`);
    }
  }
}
