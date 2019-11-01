import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appCheckForm]'
})
export class CheckFormDirective {
  constructor(private _el: ElementRef) {
    setTimeout(() => {
      for (let i = 0; i < _el.nativeElement.elements.length; i++) {
        if (_el.nativeElement.elements[i].tagName === 'INPUT' || 'TEXTAREA' && _el.nativeElement.elements[i].type !== 'hidden') {
          if (_el.nativeElement.elements[i].attributes['ng-reflect-placeholder']) {
            console.log(`${i}. Placeholder or label: ${_el.nativeElement.elements[i].attributes['ng-reflect-placeholder'].value}`);
          }
          if (_el.nativeElement.elements[i].attributes['ng-reflect-name']) {
            console.log(` - Form control name: ${_el.nativeElement.elements[i].attributes['ng-reflect-name'].value}`);
          }
          if (_el.nativeElement.elements[i].attributes['ng-reflect-value']) {
            console.log(` - Value: ${_el.nativeElement.elements[i].attributes['ng-reflect-value'].value}`);
          }
        }
      }
    });
  }
}
