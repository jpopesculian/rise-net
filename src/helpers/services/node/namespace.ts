import { kebabCase } from "lodash";

import {
  DATA,
  LOGS,
  MODULES,
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
