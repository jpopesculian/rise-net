import { includes, filter, map } from "lodash/fp";
import * as rimraf from "rimraf";
import { promisify } from "util";

import { CONFIG, DEVNET } from "../../constants/node/paths";

import { inspectNodeContainer } from "./inspect-node-container";

const PATHS = [CONFIG, DEVNET];

const deleteBoundMount = async ({ Source }: { Source: string }) => {
  return promisify(rimraf)(Source);
};

export const deleteBoundMounts = async (name: string) => {
  return Promise.all(
    map(
      deleteBoundMount,
      filter(
        mount => mount.Type === "bind" && includes(mount.Destination, PATHS),
        (await inspectNodeContainer(name)).Mounts
      )
    )
  );
};
