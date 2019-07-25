import {Directive, HostListener} from '@angular/core';
import {FormControlService} from './form-control.service';

@Directive({
  selector: '[appResetForm]'
})
export class ResetFormDirective {
  constructor(private _fcs: FormControlService) {}

  @HostListener('click') emitter() {
    this._fcs.resetForm$();
  }
}
