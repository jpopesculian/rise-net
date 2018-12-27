import { isEmpty } from "lodash/fp";

import { shp } from "./sh";

export const isContainerRunning = async (name: string) => {
  return !isEmpty((await shp`docker ps -f "name=${name}" -q`).toString());
};

export const waitUntilContainerRunning = (name: string, interval = 500) => {
  return new Promise(resolve => {
    const poll = setInterval(() => {
      isContainerRunning(name).then(() => {
        clearInterval(poll);
        resolve();
      });
    }, interval);
  });
};
