import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

export class FzUtil {
  static toTitleCase(value: string): string {
    if (this.isEmptyNull(value)) {
      return value;
    }
    return value
      .toLowerCase()
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  static isEmptyNull(object: any): boolean {
    if (typeof object == 'string') {
      return object == null || object.trim() == '';
    }
    return object == null;
  }

  static getCurrentDate(): Date {
    return new Date();
  }

  static getMonthOfDate(date: Date) {
    return dayjs(date).month();
  }

  static getYearOfDate(date: Date) {
    return dayjs(date).year();
  }

  static getNegative(number: number): number {
    return number <= 0 ? number : number * -1;
  }

  static genUUID() {
    return uuidv4();
  }

  static printMemoryUsage() {
    const formatMemoryUsage = (data: any) =>
      `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

    const memoryData = process.memoryUsage();

    const memoryUsage = {
      rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
      heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
      heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
      external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
    };

    console.log(memoryUsage);
  }

  /**
   * Agrega ceros a la izquierda de un número hasta alcanzar un tamaño máximo.
   * @param num - El número al que se le agregarán ceros.
   * @param length - La longitud total deseada.
   * @returns Una cadena con el número con ceros a la izquierda.
   */
  static padWithZeros(num: number, length: number): string {
    return num.toString().padStart(length, '0');
  }
}
