import fs from 'fs';

export const readFile = (path: string): Promise<Buffer> => new Promise((
  resolve, reject) => fs.readFile(path, (err, data: Buffer): void => {
    if (err) {
      reject(err);
      return;
    }

    resolve(data);
  })
);