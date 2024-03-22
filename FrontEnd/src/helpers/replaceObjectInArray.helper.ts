export const replaceObjectInArray = <T>(
  obj: T,
  arr: T[],
  comparative: keyof T
): T[] => {
  return arr.map((o) => {
    if (o[comparative] === obj[comparative]) {
      return obj;
    }
    return o;
  });
};
