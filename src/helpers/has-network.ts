import { isEmpty } from "lodash";

import { shp } from "./sh";

export const hasNetwork = async (name: string) => {
  return !isEmpty(
    (await shp`docker network ls -f "name=${name}" -q`).toString()
  );
};
