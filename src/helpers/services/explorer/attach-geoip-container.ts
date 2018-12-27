import { GEOIP_IMAGE } from "../../constants/explorer/images";
import { GEOIP } from "../../constants/explorer/namespace";
import { shp } from "../../sh";

import { findOrCreateNetwork } from "./find-or-create-network";
import { findOrDownloadImage } from "./find-or-download-image";

export const attachGeoipContainer = async () => {
  return shp`docker run
    --rm
    --name=${GEOIP}
    --network=${await findOrCreateNetwork()}
    -d ${await findOrDownloadImage(GEOIP_IMAGE)}`;
};
