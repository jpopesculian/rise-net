import { SNAPSHOT } from "../../helpers/constants/node/url";
import { download } from "../../helpers/download";

export const loadSnapshot = async (network: string) => {
  await download(`${SNAPSHOT}/${network}/latest`);
};
