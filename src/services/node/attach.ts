import {
  createLocalUserIdFlag
} from "../../helpers/services/node/create-local-user-id-flag";
import { prefixed } from "../../helpers/services/node/namespace";
import { sh } from "../../helpers/sh";

export const attachNode = async (name: string): Promise<number> => {
  return sh`docker exec -it
    ${await createLocalUserIdFlag()}
    "${prefixed(name)}"
    bash`;
};
