import { EXPLORER } from "../../constants/explorer/namespace";
import {
  isContainerRunning,
  waitUntilContainerRunning
} from "../../container-running";

export const isRunning = async () => {
  return isContainerRunning(EXPLORER);
};

export const waitUntilRunning = (interval = 500) => {
  return waitUntilContainerRunning(EXPLORER, interval);
};
