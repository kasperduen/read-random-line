import fs from 'fs';
import readline from 'readline';

export const readRandomLine = async (path: string): Promise<string> => {
  const totalLines: number = await countFileLines(path);
  const line = Math.floor(Math.random() * totalLines);

  return new Promise(function (resolve, reject) {
    if (line < 0 || line % 1 !== 0)
      return reject(new RangeError('Invalid line number'));

    let cursor = 0;
    const input = fs.createReadStream(path);
    const rl = readline.createInterface({ input });

    rl.on('line', function (l) {
      if (cursor++ === line) {
        rl.close();
        input.close();
        resolve(l);
      }
    });

    rl.on('error', reject);

    input.on('end', function () {
      reject(outOfRangeError(line, path));
    });
  });
};

const countFileLines = (path: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    fs.createReadStream(path)
      .on('data', (buffer: number[]) => {
        let idx = -1;
        lineCount--; // Because the loop will run once for idx=-1
        do {
          idx = buffer.indexOf(10, idx + 1);
          lineCount++;
        } while (idx !== -1);
      })
      .on('end', () => {
        resolve(lineCount);
      })
      .on('error', reject);
  });
};

const outOfRangeError = function (line: number, path: string) {
  return new RangeError(
    `Line with index ${line} does not exist in '${path}. Note that line indexing is zero-based'`
  );
};
