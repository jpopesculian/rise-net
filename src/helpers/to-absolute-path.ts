import * as path from "path";

export const toAbsolutePath = (pathname: string): string => {
  return path.isAbsolute(pathname)
    ? pathname
    : path.join(process.cwd(), pathname);
}
