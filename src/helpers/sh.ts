import { spawn } from "child_process";
import * as _ from "lodash";
import { parseArgsStringToArgv } from "string-argv";

import { cleanup } from "./cleanup";

export const sh = (
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
    const child = spawn(command, args, {
      stdio: [process.stdin, process.stdout, process.stderr]
    });
    cleanup(_code => {
      if (child.stdin) {
        child.stdin.write("\x03");
      }
      child.kill("SIGINT");
    });
    child.once("error", err => {
      reject(err);
    });
    child.once("close", code => {
      switch (code) {
        case 0:
        case 2:
        case 130:
          return resolve(code);
      }
      return reject(new Error("Exit with error code: " + code));
    });
  });
};
