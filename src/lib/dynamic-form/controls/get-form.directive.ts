import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {ObjectType} from '../../models/form-control.model';
import {FormControlService} from './form-control.service';

@Directive({
  selector: '[appGetForm]'
})
export class GetFormDirective {
  @Output() form = new EventEmitter<ObjectType>();

  constructor(private _fcs: FormControlService) {}

  @HostListener('click') emitter() {
    const form = this._fcs.form$();
    setTimeout(() => {
      this.form.emit(form);
    });
  }
}
