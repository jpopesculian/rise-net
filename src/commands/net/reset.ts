import { Command, flags } from "@oclif/command";
import cli from "cli-ux";

import { LABEL } from "../../helpers/constants/net/default-config";
import { resetNet } from "../../services/net/reset";

export default class NodeReset extends Command {
  static description = "Reset data for a network of nodes";

  static flags = {
    help: flags.help({ char: "h" }),
    label: flags.string({
      char: "l",
      description: "Label for the dev network",
      default: LABEL
    })
  };

  async run() {
    const { flags } = this.parse(NodeReset);
    cli.action.start(`Pruning nodes`);
    await resetNet(flags.label || LABEL);
    cli.action.stop();
  }
}
