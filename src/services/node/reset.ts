import {
  dataVolume,
  logVolume,
  prefixed
} from "../../helpers/services/node/namespace";
import { sh } from "../../helpers/sh";

export const resetNode = async (name: string) => {
  const prefix = prefixed(name);
  await sh`docker volume rm ${logVolume(prefix)}`;
  await sh`docker volume rm ${dataVolume(prefix)}`;
};
