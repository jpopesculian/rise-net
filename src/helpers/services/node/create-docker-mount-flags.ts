import {
  CONFIG,
  DATA,
  LOGS,
  MODULES,
  SRC_LOGS
} from "../../constants/node/paths";

import {
  dataVolume,
  logVolume,
  modulesVolume,
  srcLogsVolume
} from "./namespace";

export const createDockerMountFlags = (name: string, configDir: string) => {
  return `
    --mount "type=volume,src=${dataVolume(name)},dst=${DATA}"
    --mount "type=volume,src=${logVolume(name)},dst=${LOGS}"
    --mount "type=volume,src=${modulesVolume(name)},dst=${MODULES}"
    --mount "type=volume,src=${srcLogsVolume(name)},dst=${SRC_LOGS}"
    --mount "type=bind,src=${configDir},dst=${CONFIG}"
  `;
};
