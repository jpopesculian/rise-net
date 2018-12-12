import { setVolume } from "../../../db/node/volume";
import {
  CONFIG,
  DATA,
  LOGS,
  MODULES,
  NVM,
  SRC_LOGS
} from "../../constants/node/paths";

import {
  dataVolume,
  logVolume,
  modulesVolume,
  nvmVolume,
  srcLogsVolume
} from "./namespace";

export const createDockerMountFlags = (name: string, configDir: string) => {
  setVolume(name, true);
  return `
    --mount "type=volume,src=${dataVolume(name)},dst=${DATA}"
    --mount "type=volume,src=${logVolume(name)},dst=${LOGS}"
    --mount "type=volume,src=${modulesVolume(name)},dst=${MODULES}"
    --mount "type=volume,src=${srcLogsVolume(name)},dst=${SRC_LOGS}"
    --mount "type=volume,src=${nvmVolume(name)},dst=${NVM}"
    --mount "type=bind,src=${configDir},dst=${CONFIG}"
  `;
};
