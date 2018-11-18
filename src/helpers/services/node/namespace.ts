import { kebabCase } from "lodash";

import { DATA, LOGS, PREFIX } from "../../constants/node/namespace";

export const prefixed = (name: string) => {
  return kebabCase(`${PREFIX}-${name}`);
};

export const logVolume = (prefix: string) => {
  return `${prefix}-${LOGS}`;
};

export const dataVolume = (prefix: string) => {
  return `${prefix}-${DATA}`;
};
