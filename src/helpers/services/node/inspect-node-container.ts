import { shp } from "../../sh";

import { prefixed } from "./namespace";

export const inspectNodeContainer = async (name: string) => {
  try {
    return JSON.parse(
      (await shp`docker container inspect "${prefixed(name)}"`).toString()
    )[0];
  } catch {
    return {};
  }
};
