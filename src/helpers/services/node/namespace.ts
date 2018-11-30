import { kebabCase } from "lodash";

import {
  DATA,
  LOGS,
  MODULES,
  NVM,
  PREFIX,
  SRC_LOGS
} from "../../constants/node/namespace";

export const prefixed = (name: string) => {
  return kebabCase(`${PREFIX}-${name}`);
};

export const logVolume = (name: string) => {
  return `${prefixed(name)}-${LOGS}`;
};

export const dataVolume = (name: string) => {
  return `${prefixed(name)}-${DATA}`;
};

export const modulesVolume = (name: string) => {
  return `${prefixed(name)}-${MODULES}`;
};

export const srcLogsVolume = (name: string) => {
  return `${prefixed(name)}-${SRC_LOGS}`;
};

export const nvmVolume = (name: string) => {
  return `${prefixed(name)}-${NVM}`;
};
