import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateToLocalTimezone'
})
export class TimezonePipe implements PipeTransform {
  transform(value: any) {
    if (value) {
      const date = value instanceof Date ? value : new Date(value);
      const tzMilliseconds = Math.abs(date.getTimezoneOffset() * 60 * 1000);
      return new Date(date.valueOf() + tzMilliseconds).toISOString().split('.')[0];
    }
  }
}
