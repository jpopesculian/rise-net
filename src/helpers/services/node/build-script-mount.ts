import { isEmpty } from "lodash/fp";
import { ncp } from "ncp";
import * as path from "path";
import * as tmp from "tmp-promise";
import { promisify } from "util";

import { toAbsolutePath } from "../../to-absolute-path";

import { SCRIPTS } from "../../constants/node/paths";

const copy = promisify(ncp);

export const buildScriptMount = async (
  script: string,
  assets?: string
): Promise<string> => {
  const tmpDir = (await tmp.dir({
    mode: 0o777,
    prefix: "rise_node_scripts_"
  })).path;
  await copy(toAbsolutePath(script), path.join(tmpDir, "script.js"));
  if (assets && !isEmpty(assets)) {
    await copy(toAbsolutePath(assets), path.join(tmpDir, "assets"));
  }
  return `--mount "type=bind,src=${tmpDir},dst=${SCRIPTS}"`;
};
