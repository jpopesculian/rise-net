import {
  isContainerRunning,
  waitUntilContainerRunning
} from "../../container-running";

import { prefixed } from "./namespace";

export const isRunning = async (name: string) => {
  return isContainerRunning(prefixed(name));
};

export const waitUntilRunning = (node: string, interval = 10000) => {
  return waitUntilContainerRunning(prefixed(node), interval);
};
