import { NETWORK } from "../../constants/explorer/namespace";
import { hasNetwork } from "../../has-network";
import { shp } from "../../sh";

const createNetwork = async (name: string) => {
  return shp`docker network create
    --attachable
    "${name}"`;
};

export const findOrCreateNetwork = async (name = NETWORK) => {
  if (await hasNetwork(name)) {
    return name;
  }
  await createNetwork(name);
  return name;
};
