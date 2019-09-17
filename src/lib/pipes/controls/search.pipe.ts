import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipe implements PipeTransform {
  transform(value: any, search: string) {
    const searchParameter: string = search.split('_')[0];
    const searchInput: string = search.split('_')[1];
    return value.filter(val => {
      return val[searchParameter].toLowerCase().includes(searchInput.toLowerCase());
    });
  }
}
