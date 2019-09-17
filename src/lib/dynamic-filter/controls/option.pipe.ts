import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'option'
})
export class OptionPipe implements PipeTransform {
  transform(value: any, selectLabel: string) {
    if (selectLabel.match(/\s/g)) {
      return `${value[selectLabel.split(' ')[0]]} ${value[selectLabel.split(' ')[1]]}`;
    } else if (selectLabel.match(/\./g)) {
      return value[selectLabel.split('.')[0]][selectLabel.split('.')[1]];
    } else {
      return value['someLabel'];
    }
  }
}
