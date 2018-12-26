import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

import { LABEL } from "../../helpers/constants/net/default-config";
import { stopNet } from "../../services/net/stop";

export default class NetStop extends Command {
  static description = "Stop a running devnet";

  static flags = {
    help: flags.help({ char: "h" }),
    label: flags.string({
      char: "l",
      description: "Label for the dev network",
      default: LABEL
    }),
    remove: flags.boolean({
      char: "r",
      description: "Remove data and logs for container once stopped"
    })
  };

  async run() {
    const { flags } = this.parse(NetStop);
    const { label = LABEL, ...restFlags } = flags;
    const opts = { ...restFlags, logger: this.log };
    cli.action.start(`Stopping net: ${label}`);
    try {
      await stopNet(label, opts);
    } catch (e) {
      this.log(e);
    }
    cli.action.stop();
  }
}
