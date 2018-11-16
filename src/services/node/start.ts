import { dummyLogger, ILogger } from "../../helpers/logger";
import { sh } from "../../helpers/sh";
import { ICommandFlags } from "../../helpers/types/command-flags";

interface INodeStartFlags extends ICommandFlags {
  port?: number,
  logger: ILogger
}

export const startNode = async ({
  logger = dummyLogger,
  port = 5555
}: INodeStartFlags): Promise<any> => {
  return sh(logger)`docker run --sig-proxy=true -p 5555:${port} rise-node`;
};
