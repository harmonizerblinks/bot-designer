export const isEmptyObject = (obj: any): boolean => Object.entries(obj).length === 0
  && obj.constructor === Object;
