import * as fs from 'fs';

export class FileUtil {
  static getJsonFromFile(filename: string) {
    return JSON.parse(
      fs
        .readFileSync(process.cwd() + `/${filename}`, {
          encoding: 'utf8',
          flag: 'r',
        })
        .toString(),
    );
  }
}
