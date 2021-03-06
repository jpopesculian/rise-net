import { NETWORK } from "../../constants/net/namespace";
import { hasNetwork } from "../../has-network";
import { shp } from "../../sh";

const createNetwork = async (name: string) => {
  return shp`docker network create
    -d overlay
    --attachable
    --subnet=192.169.2.0/25
    --subnet=192.170.2.0/25
    --subnet=192.171.2.0/25
    --subnet=192.172.2.0/25
    --gateway=192.169.2.100
    --gateway=192.170.2.100
    --gateway=192.171.2.100
    --gateway=192.172.2.100
    "${name}"`;
};

export const findOrCreateNetwork = async (name = NETWORK) => {
  if (await hasNetwork(name)) {
    return name;
  }
  await createNetwork(name);
  return name;
};
