// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) throw new Error('Expected an array');

  for (const element of array) {
    await callback(element);
  }
};
