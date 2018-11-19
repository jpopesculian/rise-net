import { Bar, Presets } from "cli-progress";
import * as fs from "fs";
import { stream } from "got";
import { ClientRequest } from "http";
import { isEmpty } from "lodash";
import * as path from "path";
import * as tmp from "tmp-promise";

import { cleanup } from "./cleanup";

interface IDownloadProgress {
  percent: number,
  transferred: number,
  total: number
}

const streamToFile = (
  url: string,
  filename: string,
  onProgress: (progress: IDownloadProgress) => void
) =>
  new Promise((resolve, reject) => {
    let request: ClientRequest | null = null;
    cleanup(_code => {
      if (request !== null) {
        request.abort();
      }
    });
    stream(url)
      .on("request", req => {
        request = req;
      })
      .on("response", () => {
        request = null;
        resolve();
      })
      .on("downloadProgress", onProgress)
      .on("error", (error: string) => reject(error))
      .pipe(fs.createWriteStream(filename));
  });

export const download = async (
  url: string,
  destination?: string
): Promise<string> => {
  let filename = destination;
  if (!filename || isEmpty(filename)) {
    const postfix = path.extname(url);
    filename = (await tmp.file({ mode: 0o666, postfix })).path;
  }
  const bar = new Bar({}, Presets.shades_grey);
  bar.start(100, 0, {});
  await streamToFile(url, filename, ({ percent }) => {
    bar.update(percent * 100);
  });
  bar.stop();
  return filename;
};
