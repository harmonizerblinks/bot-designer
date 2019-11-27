export const delay = (ms = 1000): Promise<string> => new Promise((
  resolve) => setTimeout(() => resolve(), ms));
