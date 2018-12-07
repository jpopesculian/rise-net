export const LATEST_VERSION = "latest";

export const stripLatestVersion = (version?: string) => {
  return version === LATEST_VERSION ? undefined : version;
};
