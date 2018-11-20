const ROOT = "node";

export const getKey = (name: string) => {
  return `${ROOT}.${name}`;
};
