import { filter, map } from "lodash/fp";
import * as rimraf from "rimraf";
import { promisify } from "util";

import { CONFIG } from "../../constants/node/paths";

import { inspectNodeContainer } from "./inspect-node-container";

const deleteBoundMount = async ({ Source }: { Source: string }) => {
  return promisify(rimraf)(Source);
};

export const deleteBoundMounts = async (name: string) => {
  return Promise.all(
    map(
      deleteBoundMount,
      filter(
        { Type: "bind", Destination: CONFIG },
        (await inspectNodeContainer(name)).Mounts
      )
    )
  );
};
