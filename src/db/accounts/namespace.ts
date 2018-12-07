const ROOT = "accounts";

export const getKey = (name: string) => {
  return `${ROOT}.${name}`;
};
