import { getVolume, setVolume } from "../../db/node/volume";
import { dummyLogger } from "../../helpers/logger";
import { isRunning } from "../../helpers/services/node/is-running";
import {
  dataVolume,
  logVolume,
  modulesVolume,
  nvmVolume,
  srcLogsVolume
} from "../../helpers/services/node/namespace";
import { shp } from "../../helpers/sh";
import { ILogger } from "../../helpers/types/logger";

const removeVolume = async (
  volumeName: string,
  label: string,
  logger: ILogger
) => {
  try {
    await shp`docker volume rm ${volumeName}`;
    logger(`Removed ${label}`);
  } catch {
    logger(`No ${label} to remove`);
  }
};

export const resetNode = async (
  name: string,
  logger: ILogger = dummyLogger
) => {
  if (await isRunning(name)) {
    logger(`Node ${name} is currently running`);
  } else {
    await removeVolume(logVolume(name), "logs", logger);
    await removeVolume(srcLogsVolume(name), "src logs", logger);
    await removeVolume(modulesVolume(name), "modules", logger);
    await removeVolume(nvmVolume(name), "global modules", logger);
    await removeVolume(dataVolume(name), "data", logger);
  }
  if (getVolume(name)) {
    setVolume(name, false);
  }
};
