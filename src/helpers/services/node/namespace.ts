import { kebabCase } from "lodash";

import { DATA, LOGS, PREFIX } from "../../constants/node/namespace";

export const prefixed = (name: string) => {
  return kebabCase(`${PREFIX}-${name}`);
};

export const logVolume = (name: string) => {
  return `${prefixed(name)}-${LOGS}`;
};

export const dataVolume = (name: string) => {
  return `${prefixed(name)}-${DATA}`;
};
