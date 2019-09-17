import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'dateSegmentation'
})
export class DateSegmentationPipe implements PipeTransform {
  date = new Date();

  transform(value, timezone) {
    const date = new Date(value);
    const datePipe = new DatePipe(timezone);
    return (date.getDate() === this.date.getDate()) ?
      'Today' : (this.date.getDate() - date.getDate() === 1) ? 'Yesterday' : datePipe.transform(value, 'MMM dd yyyy');
  }
}
