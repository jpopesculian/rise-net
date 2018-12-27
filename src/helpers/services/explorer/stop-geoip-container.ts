import { GEOIP } from "../../constants/explorer/namespace";
import { shp } from "../../sh";

export const stopGeoipContainer = async () => {
  return shp`docker container stop ${GEOIP}`;
};
