import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

import { NODE, PORT } from "../../helpers/constants/explorer/default-config";
import { PORT as NODE_PORT } from "../../helpers/constants/node/default-config";
import { isRunning } from "../../helpers/services/explorer/is-running";
import { startExplorer } from "../../services/explorer/start";

export default class ExplorerStart extends Command {
  static description = "Start a RISE blockchain explorer instance";

  static flags = {
    help: flags.help({ char: "h" }),
    port: flags.integer({
      char: "p",
      description: "Port to start explorer on",
      default: PORT
    }),
    node: flags.string({
      char: "n",
      description: "Node to monitor",
      default: NODE
    })
  };

  async run() {
    const { flags } = this.parse(ExplorerStart);
    if (await isRunning()) {
      return this.error("Blockchain explorer is already running");
    }
    const { node = NODE, ...restFlags } = flags;
    const [nodeHost, nodePort = NODE_PORT] = node.split(":");
    if (nodeHost === "localhost" || nodeHost === "127.0.0.1") {
      this.warn("Local IPs are isolated! Please use 'container-name' instead.");
    }
    cli.action.start("Starting RISE blockchain explorer");
    await startExplorer({
      ...restFlags,
      nodeHost,
      nodePort: parseInt(nodePort.toString(), 10)
    });
    cli.action.stop();
  }
}
