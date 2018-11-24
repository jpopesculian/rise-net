import { isEmpty, merge } from "lodash";

import { getCurrentUserIdInfo, getUserIdInfoFromFile } from "../../user-id";

interface ICreateLocalUserIdFlag {
  userId?: string | number,
  groupId?: string | number,
  src?: string
}

export const createLocalUserIdFlag = async ({
  src,
  ...idArgs
}: ICreateLocalUserIdFlag): Promise<string> => {
  if (!(idArgs.userId && idArgs.groupId)) {
    idArgs = merge(
      await (isEmpty(src)
        ? getCurrentUserIdInfo()
        : getUserIdInfoFromFile(src!)),
      idArgs
    );
  }
  if (!(idArgs.userId && idArgs.groupId)) {
    return "";
  }
  return `
    -e LOCAL_USER_ID=${idArgs.userId}
    -e LOCAL_GROUP_ID=${idArgs.groupId}
  `;
};
