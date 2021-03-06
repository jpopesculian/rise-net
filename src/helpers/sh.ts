import { ChildProcess, spawn } from "child_process";
import { createWriteStream } from "fs";
import * as _ from "lodash";

import { cleanup } from "./cleanup";

const commandArgs2Array = (cmd: string): string[] => {
  return (
    cmd.match(
      /("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g
    ) || []
  ).map(arg => {
    if (arg[0] === '"' && arg[arg.length - 1] === '"') {
      return arg.slice(1, arg.length - 1);
    }
    return arg;
  });
};

const parseCommand = (
  strings: TemplateStringsArray,
  values: any[]
): string[] => {
  return commandArgs2Array(
    _(strings)
      .map((str: string) => str.replace(/\n\s*/g, " "))
      .zip(_.map(values, _.toString))
      .flatten()
      .join("")
  );
};

const killChild = (child: ChildProcess) => {
  try {
    child.stdin.write("\x03");
  } catch (e) {} // tslint:disable-line
  child.kill("SIGINT");
};

const isSuccess = (code: number): boolean => {
  switch (code) {
    case 0:
    case 2:
    case 130:
      return true;
  }
  return false;
};

export const sh = (
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<number> => {
  const [command, ...args] = parseCommand(strings, values);

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: [process.stdin, process.stdout, process.stderr]
    });
    cleanup(_code => {
      killChild(child);
    });
    child.once("error", err => {
      reject(err);
    });
    child.once("close", code => {
      if (isSuccess(code)) {
        return resolve(code);
      }
      return reject(new Error("Exit with error code: " + code));
    });
  });
};

export const shp = (
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<Buffer> => {
  const [command, ...args] = parseCommand(strings, values);
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    const child = spawn(command, args);
    cleanup(_code => {
      killChild(child);
    });
    child.stdout.on("data", chunk => {
      buffer = Buffer.concat([buffer, Buffer.from(chunk)]);
    });
    child.once("error", err => {
      reject(err);
    });
    child.once("close", code => {
      if (isSuccess(code)) {
        return resolve(buffer);
      }
      return reject(new Error(`Exit with error code: ${code}`));
    });
  });
};

export const shf = (filename: string) => async (
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<any> => {
  const [command, ...args] = parseCommand(strings, values);

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: [process.stdin, "pipe", process.stderr]
    });
    child.stdout.pipe(createWriteStream(filename));
    cleanup(_code => {
      killChild(child);
    });
    child.once("error", err => {
      reject(err);
    });
    child.once("close", code => {
      if (isSuccess(code)) {
        return resolve(code);
      }
      return reject(new Error("Exit with error code: " + code));
    });
  });
};

export const escapeSh = (str: string): string => {
  return '"' + str.replace(/(["])/g, "\\$1") + '"';
};
