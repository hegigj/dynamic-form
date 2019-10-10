import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateToLocalTimezone'
})
export class TimezonePipe implements PipeTransform {
  transform(value: any) {
    if (value) {
      console.log('Value', value);
      const date = value instanceof Date ? value : new Date(value);
      console.log('Date', date);
      const tzMilliseconds = Math.abs(date.getTimezoneOffset() * 60 * 1000);
      console.log('Millisecond', tzMilliseconds);
      return new Date(date.valueOf() + tzMilliseconds).toISOString().split('.')[0];
    }
  }
}
