import { CONFIG, DATA, LOGS } from "../../constants/node/paths";

import { dataVolume, logVolume } from "./namespace";

export const createDockerMountFlags = (name: string, configDir: string) => {
  return `
    --mount "type=volume,src=${dataVolume(name)},dst=${DATA}"
    --mount "type=volume,src=${logVolume(name)},dst=${LOGS}"
    --mount "type=bind,src=${configDir},dst=${CONFIG}"
  `;
};
