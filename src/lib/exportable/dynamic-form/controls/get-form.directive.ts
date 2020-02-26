import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';
import {FormControlService} from './form-control.service';
import {ObjectType} from '../../../common/models/extra.model';

@Directive({
  selector: '[appGetForm]'
})
export class GetFormDirective {
  @Output() form = new EventEmitter<ObjectType>();
  @HostBinding('disabled') disabled: boolean;

  constructor(private _fcs: FormControlService) {
    this._formValidity();
  }

  @HostListener('click') emitter() {
    const form = this._cleanForm(this._fcs.form$);
    setTimeout(() => {
      this.form.emit(form);
    });
  }

  private _cleanForm(form): ObjectType {
    Object.keys(form)
      .forEach(key => (form[key] === undefined || form[key] === null || form[key] === '') ? delete form[key] : NaN);
    return form;
  }

  private _formValidity() {
    this._fcs.formValidity$.subscribe((INVALID: string) => this.disabled = INVALID !== 'VALID');
  }
}
