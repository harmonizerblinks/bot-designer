import path from 'path';

export const isEmptyObject = (obj: any): boolean => Object.entries(obj).length === 0
  && obj.constructor === Object;

export const getRootPath = () => path.join(__dirname, '').split('/src')[0];
