import { ncp } from "ncp";
import * as path from "path";
import * as tmp from "tmp-promise";
import { promisify } from "util";

import { toAbsolutePath } from "../../to-absolute-path";

export const buildDownloadsDir = async (
  snapshotFile: string
): Promise<string> => {
  const tmpDir = (await tmp.dir({
    mode: 0o777,
    prefix: "rise_downloads_",
    unsafeCleanup: true
  })).path;
  await promisify(ncp)(
    toAbsolutePath(snapshotFile),
    path.join(tmpDir, "snapshot.gz")
  );
  return tmpDir;
};
