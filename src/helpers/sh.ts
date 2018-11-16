import { spawn } from "child_process";
import * as _ from "lodash";
import { parseArgsStringToArgv } from "string-argv";

import { cleanup } from "./cleanup";
import { dummyLogger, ILogger } from "./logger";

export const sh = (logger: ILogger = dummyLogger) => (
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<number> => {
  const [command, ...args] = parseArgsStringToArgv(
    _(strings)
      .map((str: string) => str.replace(/\n\s*/g, " "))
      .zip(_.map(values, _.toString))
      .flatten()
      .join("")
  );

  return new Promise((resolve, reject) => {
    const child = spawn(command, args);
    cleanup(_code => {
      child.kill("SIGINT");
    });
    child.on("error", err => {
      reject(err);
    });
    child.stdout.on("data", chunk => {
      logger(chunk.toString());
    });
    child.stderr.on("data", chunk => {
      logger(chunk.toString());
    });
    child.on("close", code => {
      if (code !== 0) {
        return reject(code);
      }
      resolve(code);
    });
  });
};
