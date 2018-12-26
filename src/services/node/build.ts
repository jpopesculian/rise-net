import * as path from "path";

import { imageName } from "../../helpers/services/node/image-version";
import { sh } from "../../helpers/sh";

export const buildNode = async (version?: string): Promise<number> => {
  const dockerDir = path.join(__dirname, "..", "..", "..", "docker", "dev");
  const cwd = process.cwd();
  process.chdir(dockerDir);
  const code = await sh`docker build -t ${imageName(version)} .`;
  process.chdir(cwd);
  return code;
};
