import { EXPLORER } from "../../helpers/constants/explorer/namespace";
import { stopGeoipContainer } from "../../helpers/services/explorer/stop-geoip-container";
import { stopRedisContainer } from "../../helpers/services/explorer/stop-redis-container";
import { shp } from "../../helpers/sh";
import { ICommandFlags } from "../../helpers/types/command-flags";

interface IExplorerCommandFlags extends ICommandFlags {
  port?: number;
}

export const stopExplorer = async ({  }: IExplorerCommandFlags) => {
  await stopRedisContainer();
  await stopGeoipContainer();
  await shp`docker container stop ${EXPLORER}`;
};
