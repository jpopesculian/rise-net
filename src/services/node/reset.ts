import { dataVolume, logVolume } from "../../helpers/services/node/namespace";
import { shp } from "../../helpers/sh";

export const resetNode = async (name: string) => {
  await shp`docker volume rm ${logVolume(name)}`;
  await shp`docker volume rm ${dataVolume(name)}`;
};
