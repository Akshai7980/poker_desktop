import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'math'
})
export class MathPipe implements PipeTransform {
  transform(value: number, args?: string, args1?: string): string | number {
    if (args === 'ceil') {
      return Math.ceil(value);
    }

    if (args === 'floor') {
      return Math.floor(value);
    }

    if (args === 'round') {
      return Math.round(value);
    }

    if (args === 'toFixed') {
      const numberData = Number(value);
      const fixPosition = Number(args1);
      if (numberData % 1 === 0) {
        return numberData;
      }
      return numberData.toFixed(fixPosition);
    }

    if (args === 'ordinal') {
      const num = Number(value);
      const ones = num % 10;
      const tens = num % 100;
      if (tens < 11 || tens > 13) {
        switch (ones) {
          case 1:
            return `${num}st`;
          case 2:
            return `${num}nd`;
          case 3:
            return `${num}rd`;
          default:
            break;
        }
      }
      return `${num}th`;
    }

    if (args === 'INR') {
      if (value && !Number.isNaN(value)) {
        const numValue = Number(value);
        const stringVal = Math.ceil(numValue).toString();
        if (stringVal.length > 4) {
          return numValue.toLocaleString('en-IN');
        }
        return numValue;
      }
    }

    if (args === 'parseToInt') {
      if (value.toString() !== '') {
        const numValue = Number(value);
        if (numValue > 9900000) {
          return parseInt(numValue.toString(), 10);
        }
        return numValue;
      }
    }

    return value;
  }
}
