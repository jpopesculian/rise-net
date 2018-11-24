import { statSync } from "fs";

import { shp } from "./sh";
import { toAbsolutePath } from "./to-absolute-path";

interface IUserIdInfo {
  userId?: number,
  groupId?: number
}

const isWindows = (): boolean => process.platform === "win32";

export const getUserIdInfoFromFile = async (
  filename: string
): Promise<IUserIdInfo> => {
  if (isWindows()) {
    return {};
  }
  const stats = statSync(toAbsolutePath(filename));
  return { userId: stats.uid, groupId: stats.gid };
};

export const getCurrentUserIdInfo = async (): Promise<IUserIdInfo> => {
  if (isWindows()) {
    return {};
  }
  const userId = parseInt((await shp`id -u`).toString().trim(), 10);
  const groupId = parseInt((await shp`id -g`).toString().trim(), 10);
  return { userId, groupId };
};
