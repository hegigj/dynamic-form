import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appInjectComponent]'
})
export class InjectComponentDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
