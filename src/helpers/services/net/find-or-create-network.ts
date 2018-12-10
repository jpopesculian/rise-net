import { isEmpty } from "lodash/fp";

import { NETWORK } from "../../constants/net/namespace";
import { shp } from "../../sh";

const hasNetwork = async (name: string) => {
  return !isEmpty(
    (await shp`docker network ls -f "name=${name}" -q`).toString()
  );
};

const createNetwork = async (name: string) => {
  return shp`docker network create --attachable "${name}"`;
};

export const findOrCreateNetwork = async (name = NETWORK) => {
  if (await hasNetwork(name)) {
    return name;
  }
  await createNetwork(name);
  return name;
};
