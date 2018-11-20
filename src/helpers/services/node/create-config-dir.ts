import { ncp } from "ncp";
import * as path from "path";
import * as tmp from "tmp-promise";
import { promisify } from "util";

export const createConfigDir = async (): Promise<string> => {
  const defaultConfigDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "docker",
    "build-assets",
    "etc"
  );
  const tmpDir = (await tmp.dir({
    mode: 0o777,
    prefix: "rise_config_",
    unsafeCleanup: true
  })).path;
  await promisify(ncp)(defaultConfigDir, tmpDir);
  return tmpDir;
};