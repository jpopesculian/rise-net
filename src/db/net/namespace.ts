const ROOT = "net";

export const getKey = (name: string) => {
  return `${ROOT}.${name}`;
};
