import {Injectable} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormControlModel} from '../models/form-control.model';

@Injectable()
export class FormControlService {
  constructor() {}

  create(fields: FormControlModel[], method: string) {
    let formGroup: any = {};

    formGroup = this._fgCreator(formGroup, fields, method);

    return new FormGroup(formGroup);
  }

  private _fgCreator(fg: any, fields: FormControlModel[], method: string) {
    fields.forEach((field) => {
      const value = field.value ? field.value : '';
      const disabled = field.disabled !== undefined ?
        field.disabled : method === 'POST' ? !field.canPost : method === 'PUT' ? !field.canPut : true;

      if (field.canGet) {
        Object.assign(fg,
          {
            [field.fieldName]: field.inputType.match(/AREA/g) ?
              new FormArray(
                this._formArrayFiller(value, disabled, this._validators(field.constraintList, field.required))
              ) : new FormControl(
                {value: value, disabled: disabled},
                field.fieldName === 'id' ? [] : this._validators(field.constraintList, field.required)
              )
          }
        );
      }
    }); return fg;
  }

  private _validators(field: any, required?) {
    const validatorsArray = [];

    if (required) {
      validatorsArray.push(Validators.required);
    }

    Object.keys(field).forEach((key) => {
      if (key === 'Size') {
        validatorsArray.push(Validators.minLength(field[key].min));
        validatorsArray.push(Validators.maxLength(field[key].max));
      }
      if (key === 'Min') {
        validatorsArray.push(Validators.min(field[key].min));
      }
      if (key === 'Max') {
        validatorsArray.push(Validators.max(field[key].max));
      }
      if (key === 'NotNull') {
        validatorsArray.push(Validators.required);
      }
      if (key === 'Pattern') {
        if (!field[key].regexp.match(/yyyy-MM-dd/g)) {
          validatorsArray.push(Validators.pattern(field[key].regexp));
        }
      }
    }); return validatorsArray;
  }

  private _formArrayFiller(values: any, disabled: boolean, validators: any) {
    const formArray = [];
    if (typeof values === 'object') {
      values.forEach((value) => {
        formArray.push(new FormControl({value: value, disabled: disabled}, validators));
      });
    } return formArray;
  }
}
