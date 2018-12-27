import { REDIS } from "../../constants/explorer/namespace";
import { shp } from "../../sh";

export const stopRedisContainer = async () => {
  return shp`docker container stop ${REDIS}`;
};
