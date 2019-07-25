import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormControlModel} from '../../models/form-control.model';

@Injectable()
export class FilterControlService {
  constructor() {}

  create(fields: FormControlModel[]) {
    let formGroup: any = {};

    formGroup = this._fgCreator(formGroup, fields);

    return new FormGroup(formGroup);
  }

  private _fgCreator(fg: any, fields: FormControlModel[]) {
    fields.forEach((field) => {
      const disabled = field.disabled !== undefined ? field.disabled : false;

      Object.assign(fg,
        {
          [field.fieldName]: field.inputType.match(/BETWEEN/g) ?
            new FormGroup({
              min: new FormControl({value: '', disabled: disabled}),
              max: new FormControl({value: '', disabled: disabled})
            }) : new FormControl(
              {value: '', disabled: disabled},
              this._validators(field.constraintList, field.required)
            )
        }
      );
    }); return fg;
  }

  private _validators(field: any, required?) {
    const validatorsArray = [];
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
      if (key === 'NotNull' || required) {
        validatorsArray.push(Validators.required);
      }
      if (key === 'Pattern') {
        if (!field[key].regexp.match(/yyyy-MM-dd/g)) {
          validatorsArray.push(Validators.pattern(field[key].regexp));
        }
      }
    }); return validatorsArray;
  }
}
