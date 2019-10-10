import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'character'
})
export class CharacterPipe implements PipeTransform {
  transform(value: string, type: string) {
    if (type) {
      const characters: number = parseInt(type.split('char_')[1], 10);
      return value ? (value.length > characters ? `${value.substr(0, characters - 3)}...` : value) : '';
    } else {
      return value ? value : '';
    }
  }
}
