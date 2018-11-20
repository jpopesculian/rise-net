import { getVersion, setVersion } from "../../../db/node/version";
import { buildNode } from "../../../services/node/build";
import { VERSION } from "../../constants/node/default-config";
import { shp } from "../../sh";

export const validVersion = (version: string): boolean => {
  return /[0-9]+\.[0-9]+\.[0-9]+/.test(version);
};

export const imageName = (version: string = VERSION) => {
  if (!validVersion(version)) {
    throw new Error(`Invalid version: ${version}`);
  }
  return `rise-node:${version}`;
};

export const hasVersionImage = async (version: string): Promise<boolean> => {
  const result = await shp`docker image ls ${imageName(version)} -aq`;
  if (result.length > 0) {
    return true;
  }
  return false;
};

export const initContainerImage = async (
  name: string,
  version?: string
): Promise<string> => {
  if (!version) {
    version = getVersion(name) || VERSION;
  }
  if (!await hasVersionImage(version)) {
    await buildNode(version);
  }
  setVersion(name, version);
  return version;
};
