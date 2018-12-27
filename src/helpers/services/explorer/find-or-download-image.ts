import { isEmpty } from "lodash/fp";

import { sh, shp } from "../../sh";

const hasImage = async (name: string) => {
  return !isEmpty(await shp`docker images -q ${name}`);
};

export const findOrDownloadImage = async (name: string): Promise<string> => {
  if (await hasImage(name)) {
    return name;
  }
  await sh`docker pull ${name}`;
  return name;
};
