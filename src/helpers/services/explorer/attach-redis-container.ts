import { REDIS_IMAGE } from "../../constants/explorer/images";
import { REDIS } from "../../constants/explorer/namespace";
import { shp } from "../../sh";

import { findOrCreateNetwork } from "./find-or-create-network";
import { findOrDownloadImage } from "./find-or-download-image";

export const attachRedisContainer = async () => {
  return shp`docker run
    --rm
    --name=${REDIS}
    --network=${await findOrCreateNetwork()}
    -d ${await findOrDownloadImage(REDIS_IMAGE)}`;
};
