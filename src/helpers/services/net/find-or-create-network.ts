import { isEmpty } from "lodash/fp";

import { NETWORK } from "../../constants/net/namespace";
import { shp } from "../../sh";

const hasNetwork = async (name: string) => {
  return !isEmpty(
    (await shp`docker network ls -f "name=${name}" -q`).toString()
  );
};

const createNetwork = async (name: string) => {
  return shp`docker network create
    -d overlay
    --attachable
    --subnet=192.168.1.0/25
    --subnet=192.169.1.0/25
    --subnet=192.170.2.0/25
    --subnet=192.171.2.0/25
    --gateway=192.168.1.100
    --gateway=192.169.1.100
    --gateway=192.170.2.100
    --gateway=192.171.2.100
    "${name}"`;
};

export const findOrCreateNetwork = async (name = NETWORK) => {
  if (await hasNetwork(name)) {
    return name;
  }
  await createNetwork(name);
  return name;
};
