import { dummyLogger, ILogger } from "../../helpers/logger";
import {
  dataVolume,
  logVolume,
  modulesVolume,
  srcLogsVolume
} from "../../helpers/services/node/namespace";
import { shp } from "../../helpers/sh";

const removeVolume = async (
  volumeName: string,
  label: string,
  logger: ILogger
) => {
  try {
    await shp`docker volume rm ${volumeName}`;
    logger(`Removed ${label}`);
    // tslint:disable-next-line no-unused
  } catch (e) {
    logger(`No ${label} to remove`);
  }
};

export const resetNode = async (
  name: string,
  logger: ILogger = dummyLogger
) => {
  await removeVolume(logVolume(name), "logs", logger);
  await removeVolume(srcLogsVolume(name), "src logs", logger);
  await removeVolume(modulesVolume(name), "modules", logger);
  await removeVolume(dataVolume(name), "data", logger);
};