export type ILogger = (str: string) => void;

export const dummyLogger = (_str: string) => {
  return;
};
