import { isEmpty } from "lodash/fp";

import { shp } from "../../sh";

import { prefixed } from "./namespace";

export const isRunning = async (name: string) => {
  return !isEmpty(
    (await shp`docker ps -f "name=${prefixed(name)}" -q`).toString()
  );
};

export const waitUntilRunning = (node: string, interval = 10000) => {
  return new Promise(resolve => {
    const poll = setInterval(() => {
      isRunning(node).then(() => {
        clearInterval(poll);
        resolve();
      });
    }, interval);
  });
};
