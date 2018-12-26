import { ncp } from "ncp";
import * as path from "path";
import * as tmp from "tmp-promise";
import { promisify } from "util";

export const createConfigDir = async (preserve: boolean): Promise<string> => {
  const defaultConfigDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "docker",
    "dev",
    "build-assets",
    "etc"
  );
  const tmpDir = (await tmp.dir({
    mode: 0o777,
    prefix: "rise_config_",
    unsafeCleanup: !preserve
  })).path;
  await promisify(ncp)(defaultConfigDir, tmpDir);
  return tmpDir;
};
