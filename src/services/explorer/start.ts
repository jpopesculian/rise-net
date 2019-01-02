import { NODE, PORT } from "../../helpers/constants/explorer/default-config";
import { EXPLORER_IMAGE } from "../../helpers/constants/explorer/images";
import {
  EXPLORER,
  GEOIP,
  REDIS
} from "../../helpers/constants/explorer/namespace";
import { attachGeoipContainer } from "../../helpers/services/explorer/attach-geoip-container";
import { attachRedisContainer } from "../../helpers/services/explorer/attach-redis-container";
import { findOrCreateNetwork } from "../../helpers/services/explorer/find-or-create-network";
import { findOrDownloadImage } from "../../helpers/services/explorer/find-or-download-image";
import { waitUntilRunning } from "../../helpers/services/explorer/is-running";
import { sh, shp } from "../../helpers/sh";
import { ICommandFlags } from "../../helpers/types/command-flags";

interface IExplorerCommandFlags extends ICommandFlags {
  port?: number;
  node?: string;
}

export const startExplorer = async ({
  port = PORT,
  node = NODE
}: IExplorerCommandFlags) => {
  const [nodeHost, nodePort] = node.split(":");
  await attachRedisContainer();
  await attachGeoipContainer();
  await shp`docker run
    --rm
    -d
    -p ${port}:${PORT}
    --name=${EXPLORER}
    -e LISK_HOST=${nodeHost} \
    -e LISK_PORT=${nodePort} \
    -e REDIS_HOST=${REDIS} \
    -e FREEGEOIP_HOST=${GEOIP} \
    --network=${await findOrCreateNetwork()}
    -d ${await findOrDownloadImage(EXPLORER_IMAGE)}`;
  await waitUntilRunning();
  await sh`docker exec -it ${EXPLORER}
    /home/lisk/lisk-explorer/node_modules/grunt/bin/grunt
    candles:build`;
};
