import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

import { isRunning } from "../../helpers/services/explorer/is-running";
import { stopExplorer } from "../../services/explorer/stop";

export default class ExplorerStop extends Command {
  static description = "Stop a RISE blockchain explorer instance";

  static flags = {
    help: flags.help({ char: "h" })
  };

  async run() {
    const { flags } = this.parse(ExplorerStop);
    if (!(await isRunning())) {
      return this.error("Blockchain explorer not running");
    }
    cli.action.start("Stopping RISE blockchain explorer");
    await stopExplorer(flags);
    cli.action.stop();
  }
}
