import {Injectable} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormControlModel} from '../../../common/models/form-control.model';
import {FilterOrderConfig} from '../models/filter-order-config';
import {TimezonePipe} from '../../../common/controls/timezone.pipe';

@Injectable()
export class FilterControlService {
  timestampPattern: string;

  constructor() {
    this.timestampPattern = '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}';
  }

  setTimestamp$(control: {fg: FormGroup, fieldName: string, isArray?: number}, timestamp: {date?: string, time?: string}): void {
    const date: string = timestamp.date;
    const time: string = timestamp.time;
    let oldDate: string, oldTime: string;
    let formControl: AbstractControl = control.fg.controls[control.fieldName];
    if (control.isArray >= 0) {
      formControl = (<FormArray>formControl).at(control.isArray);
    }
    if (formControl.value.match(this.timestampPattern)) {
      oldDate = formControl.value.split('T')[0];
      oldTime = formControl.value.split('T')[1];
    }
    formControl.setValue('');
    setTimeout(() => {
      if (date && time) {
        formControl.setValue(`${date}T${time}`);
      } else if (date) {
        formControl.setValue(`${date}T${oldTime ? oldTime : '00:00:00'}`);
      } else if (time) {
        formControl.setValue(`${oldDate ? oldDate : new TimezonePipe().transform(new Date()).split('T')[0]}T${time}`);
      } else {
        formControl.setValue('');
      }
    });
  }

  create(fields: FormControlModel[]) {
    const formGroup: any = this._fgCreator(fields);
    return new FormGroup(formGroup);
  }

  private _fgCreator(fields: FilterOrderConfig[]) {
    const fg: any = {};
    fields.forEach((field) => {
      const value = field.value ? field.value : '';
      const disabled = field.disabled !== undefined ? field.disabled : false;

      Object.assign(fg,
        {
          [field.fieldName]: field.inputType.match(/BETWEEN/g) ?
            new FormGroup({
              min: new FormControl(
                {value: value, disabled: disabled},
                Validators.pattern(this.timestampPattern)
              ),
              max: new FormControl(
                {value: value, disabled: disabled},
                Validators.pattern(this.timestampPattern)
              )
            }) : new FormControl(
              {value: value, disabled: disabled},
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
        validatorsArray.push(
          Validators.pattern(field[key].regexp.match(/yyyy-MM-dd'T'HH:mm:ss/g) ? this.timestampPattern : field[key].regexp)
        );
      }
    });
    return validatorsArray;
  }
}
