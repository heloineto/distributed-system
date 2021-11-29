export const indexOfNth = (str: string, subStr: string, index: number) =>
  str.split(subStr, index).join(subStr).length;
