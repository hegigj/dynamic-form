import {Pipe, PipeTransform} from '@angular/core';
import {OptionPipe} from './option.pipe';

@Pipe({
  name: 'display'
})
export class ComboDisplayPipe implements PipeTransform {
  transform(value: any, finder: string) {
    return typeof value === 'object' ? new OptionPipe().transform(value, finder) : value;
  }
}
