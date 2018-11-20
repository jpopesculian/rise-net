import { Bar, Presets } from "cli-progress";
import * as fs from "fs";
import { stream } from "got";
import { ClientRequest } from "http";
import { isEmpty } from "lodash";
import * as path from "path";
import { finished } from "stream";
import * as tmp from "tmp-promise";

import { cleanup } from "./cleanup";

interface IDownloadProgress {
  percent: number,
  transferred: number,
  total: number
}

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

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
    const fileStream = stream(url)
      .on("request", req => {
        request = req;
      })
      .on("downloadProgress", onProgress)
      .on("error", (error: string) => reject(error))
      .pipe(fs.createWriteStream(filename));
    finished(fileStream, err => {
      request = null;
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });

const formatBitAmount = (amount: number): string => {
  let dividedAmount = amount;
  let label = "";
  if (amount > GB) {
    dividedAmount = amount / GB;
    label = "GB";
  } else if (amount > MB) {
    dividedAmount = amount / MB;
    label = "MB";
  } else if (amount > KB) {
    dividedAmount = amount / KB;
    label = "KB";
  }
  return `${Math.round(dividedAmount * 100) / 100} ${label}`;
};

export const download = async (
  url: string,
  { destination, keep }: { destination?: string, keep?: boolean } = {}
): Promise<string> => {
  let filename = destination;
  if (!filename || isEmpty(filename)) {
    const postfix = path.extname(url);
    filename = (await tmp.file({ mode: 0o666, postfix, keep })).path;
  }
  const bar = new Bar(
    {
      format: "{bar} {percentage}% | ETA: {eta}s | {transferred} / {size}",
      etaBuffer: 100000
    },
    Presets.shades_grey
  );
  bar.start(1, 0, {
    transferred: "",
    size: ""
  });
  await streamToFile(url, filename, ({ percent, transferred, total }) => {
    bar.update(percent, {
      transferred: formatBitAmount(transferred),
      size: formatBitAmount(total)
    });
  });
  bar.stop();
  return filename;
};
