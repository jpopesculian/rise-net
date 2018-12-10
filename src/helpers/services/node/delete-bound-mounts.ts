import { filter, map } from "lodash/fp";
import * as rimraf from "rimraf";
import { promisify } from "util";

import { CONFIG } from "../../constants/node/paths";
import { shp } from "../../sh";

const deleteBoundMount = async ({ Source }: { Source: string }) => {
  return promisify(rimraf)(Source);
};

export const deleteBoundMounts = async (name: string) => {
  const config = JSON.parse(
    (await shp`docker container inspect "${name}"`).toString()
  )[0];
  return Promise.all(
    map(
      deleteBoundMount,
      filter({ Type: "bind", Destination: CONFIG }, config.Mounts)
    )
  );
};
