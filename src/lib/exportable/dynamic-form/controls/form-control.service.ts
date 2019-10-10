import {Injectable} from '@angular/core';
import {FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ObjectType} from '../../../common/models/form-control.model';
import {FormOrderConfig} from '../models/form-order-config';
import {FormOrder} from '../models/form-order';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class FormControlService {
  private _order: FormOrder;
  private _form: FormGroup;

  private _formValidity: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor() {}

  setForm$(form: FormGroup, order?: FormOrder, validity?: string) {
    if (order) {
      this._order = order;
    } if (validity) {
      this._formValidity.next(validity);
    } this._form = form;
  }

  get formValidity$(): Observable<string> {
    return this._formValidity.asObservable();
  }

  resetForm$() {
    if (this._form) {
      if (this._order) {
        Object.keys(this._order).forEach((key) => {
          if (this._order[key].canReset === undefined || this._order[key].canReset) {
            this._form.controls[key].setValue('');
          }
        });
      } else {
        this._form.reset();
      }
    }
  }

  form$() {
    const object: ObjectType = {};
    if (this._form) {
      const controls = this._form.controls;
      Object.keys(controls).forEach((key) => {
        Object.assign(object, {[key]: controls[key].value});
      });
      return object;
    } else {
      return object;
    }
  }

  create(fields: FormOrderConfig[], method?: string) {
    let formGroup: any = {};

    formGroup = this._fgCreator(formGroup, fields, method);

    return new FormGroup(formGroup);
  }

  private _fgCreator(fg: any, fields: FormOrderConfig[], method?: string) {
    fields.forEach((field) => {
      const value = field.value ? field.value : '';
      const disabled = field.disabled !== undefined ?
        field.disabled : method === 'POST' ? !field.canPost : method === 'PUT' ? !field.canPut : true;

      if (field.canGet) {
        Object.assign(fg,
          {
            [field.fieldName]: field.inputType.match(/AREA/g) ?
              new FormArray(
                this._formArrayFiller(value, disabled, this._validators(field, field.constraintList, field.required))
              ) : new FormControl(
                {value: value, disabled: disabled},
                field.fieldName === 'id' ? [] : this._validators(field, field.constraintList, field.required)
              )
          }
        );
      }
    }); return fg;
  }

  private _validators(field: FormOrderConfig, constraints: any, required?) {
    const validatorsArray = [];
    const errorMessage: ObjectType = {};
    Object.keys(constraints).forEach((key) => {
      switch (key) {
        case 'Size':
          // Validators
          validatorsArray.push(Validators.minLength(constraints[key].min));
          validatorsArray.push(Validators.maxLength(constraints[key].max));
          // Error Messages
          Object.assign(errorMessage, {'minlength': constraints[key].message});
          Object.assign(errorMessage, {'maxlength': constraints[key].message});
          break;
        case 'Min':
          // Validators
          validatorsArray.push(Validators.min(constraints[key].min));
          // Error Messages
          Object.assign(errorMessage, {'min': constraints[key].message});
          break;
        case 'Max':
          // Validators
          validatorsArray.push(Validators.max(constraints[key].max));
          // Error Messages
          Object.assign(errorMessage, {'max': constraints[key].message});
          break;
        case 'NotNull':
          // Validators
          validatorsArray.push(Validators.required); required = false;
          // Error Messages
          Object.assign(errorMessage, {'required': constraints[key].message});
          break;
        case 'Pattern':
          if (constraints[key].regexp.match(/yyyy-MM-dd'T'HH:mm:ss/g)) {
            const timestampPattern = '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}';
            validatorsArray.push(Validators.pattern(timestampPattern));
          } else {
            validatorsArray.push(Validators.pattern(constraints[key].regexp));
          } Object.assign(errorMessage, {'pattern': constraints[key].message});
          break;
        default:
          console.log(`${key.toUpperCase()} is not a constraint that it's known in this form`);
      }
    });
    if (required) {
      // Validators
      validatorsArray.push(Validators.required);
      // Error Messages
      Object.assign(errorMessage, {'required': 'This field is required'});
    } if (field.customValidators) {
      field.customValidators.forEach((customValidator) => validatorsArray.push(customValidator));
    } field.errorMessages = errorMessage;
    return validatorsArray;
  }

  private _formArrayFiller(values: any, disabled: boolean, validators: ValidatorFn | any) {
    const formArray = [];
    if (typeof values === 'object') {
      values.forEach((value) => {
        formArray.push(new FormControl({value: value, disabled: disabled}, validators));
      });
    } else {
      formArray.push(new FormControl({value: values, disabled: disabled}, validators));
    } return formArray;
  }
}
