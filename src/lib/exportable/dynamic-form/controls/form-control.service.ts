import {Injectable} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FormOrderConfig} from '../models/form-order-config';
import {FormOrder} from '../models/form-order';
import {BehaviorSubject, Observable} from 'rxjs';
import {TimezonePipe} from '../../../common/controls/timezone.pipe';
import {FieldMapModel} from '../../../common/models/fieldMap.model';
import {Constraint, ObjectType} from '../../../common/models/extra.model';

interface Field {
  field: FieldMapModel;
  order?: FormOrderConfig;
  method?: 'POST' | 'PUT' | string;
}

@Injectable()
export class FormControlService {
  private _form: FormGroup;
  private _order: FormOrder;
  private _fieldArray: Field;
  private _formArray: FormArray;

  private _formValidity: BehaviorSubject<string> = new BehaviorSubject<string>('INVALID');

  constructor(private _formBuilder: FormBuilder) {}

  setTimestamp$(control: {fieldName: string, isArray?: number}, timestamp: {date?: string, time?: string}): void {
    const date: string = timestamp.date;
    const time: string = timestamp.time;
    let oldDate: string, oldTime: string;
    let formControl: AbstractControl = this._form.controls[control.fieldName];
    if (control.isArray >= 0) {
      formControl = (<FormArray>formControl).at(control.isArray); // turning formControl to array at a specified index(in our case isArray)
    }
    if (formControl.value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g)) {
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

  setForm$(form: FormGroup, order?: FormOrder, validity?: string) {
    this._form = form;
    // noinspection TsLint
    if (order) this._order = order;
    // noinspection TsLint
    if (validity) this._formValidity.next(validity);
  }

  resetForm$() {
    if (this._form) {
      this._order ?
        Object.keys(this._order)
          .forEach(key =>
            (this._order[key].canReset === undefined || this._order[key].canReset) ? this._form.controls[key].setValue('') : NaN) :
        this._form.reset();
    }
  }

  get form$() {
    return this._form ? this._form.value : {};
  }

  get formValidity$(): Observable<string> {
    return this._formValidity.asObservable();
  }

  deleteFormArray(index: number) {
    this._formArray.removeAt(index);
  }

  addFormArray(index?: number, field?: Field) {
    if (index) {
      this._formArray.length > (index + 1) ?
        this._formArray.insert(index + 1, this._formArrayForm(field ? field : this._fieldArray)) :
        this._formArray.push(this._formArrayForm(field ? field : this._fieldArray));
    } else {
      this._formArray.push(this._formArrayForm(field ? field : this._fieldArray));
    }
  }

  create(fields: FormOrderConfig[] | FieldMapModel, method: string = null) {
    const field = this._toArray(fields);
    const formGroup = this._fgCreator(field, method);
    return new FormGroup(formGroup);
  }

  private _toArray(fields: FormOrderConfig[] | FieldMapModel): FormOrderConfig[] {
    let fieldArray: FormOrderConfig[] = [];
    if (!(fields instanceof Array)) {
      Object.values(fields).forEach(field => fieldArray.push(field));
    } else {
      fieldArray = fields;
    }
    return fieldArray;
  }

  private _fgCreator(fields: FormOrderConfig[], method?: string) {
    const fg: any = {};
    fields.forEach((field) => {
      // set value of the controller
      const value = field.value ? field.value : '';
      // set if the controller is disabled or not
      const disabled = field.disabled !== undefined ? field.disabled :
        method === 'POST' ? !field.canPost :
          method === 'PUT' ? !field.canPut :
            true;
      // create the controller
      if (field.canGet) {
        Object.assign(fg,
          {
            [field.fieldName]: field.inputType.match(/AREA/g) ?
              new FormArray(
                this._formArrayControl(value, disabled, this._validators(field, field.constraintList, field.required)) // field array
              ) : field.inputType.match(/TABLE/g) ?
              this._formBuilder.array(
                  [this._formArrayForm({field: field.childFieldMeta, order: field.childField, method: method})] // form array
              ) : new FormControl(
                {value: value, disabled: disabled},
                this._setValidators(field, method)
              )
          }
        );
      }
      // check if the controller is an FormArray
      if (fg[field.fieldName] instanceof FormArray) {
        this._fieldArray = {field: field.childFieldMeta, order: field.childField, method: method};
        this._formArray = fg[field.fieldName];
      }
    });
    return fg;
  }

  private _formArrayForm(field: Field): FormGroup {
    let hasValue: boolean;
    const _formArray: FormOrderConfig[] = [];
    Object.keys(field.order ? field.order : field.field).forEach(key => {
      if (field.order) {
        Object.assign(field.field[key], field.order[key]);
        (field.order[key].value !== '' || undefined || null) ? hasValue = true : NaN;
      }
      _formArray.push(field.field[key]);
    });
    const _formGroup = this._fgCreator(_formArray, field.method ? field.method : hasValue ? 'PUT' : 'POST');
    return this._formBuilder.group(_formGroup);
  }

  private _formArrayControl(values: any, disabled: boolean, validators: ValidatorFn | any) {
    const formArray = [];
    typeof values === 'object' ? values.forEach((value) => {
              formArray.push(new FormControl({value: value, disabled: disabled}, validators));
            }) : formArray.push(new FormControl({value: values, disabled: disabled}, validators));
    return formArray;
  }

  private _setValidators(field: FormOrderConfig, method?: string): ValidatorFn[] {
    return (field.fieldName === 'id' && method === 'POST') ? [] : this._validators(field, field.constraintList, field.required);
  }

  private _validators(field: FormOrderConfig, constraints: Constraint, required?: boolean): ValidatorFn[] {
    const validatorsArray = [];
    const errorMessage: ObjectType = {};
    const matcherPattern = `yyyy-MM-dd'T'HH:mm:ss`;
    const timestampPattern = `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}`;
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
          validatorsArray.push(Validators.required);
          // Error Messages
          Object.assign(errorMessage, {'required': constraints[key].message});
          // If Required is true make it false, because it was checked from NotNull Constraint
          required = false;
          break;
        case 'Past':
          // Validators Function for Past Date
          const date = new Date().toISOString().split('.')[0];
          const pastDate = (control: FormControl): {[key: string]: boolean} | null => {
            return control.value > date ? {'past': true} : null;
          };
          // Validators
          validatorsArray.push(pastDate.bind(this));
          // Error Messages
          Object.assign(errorMessage, {'past': constraints[key].message});
          break;
        case 'Pattern':
          // Validators
          validatorsArray.push(Validators.pattern(constraints[key].regexp.match(matcherPattern) ? timestampPattern : constraints[key].regexp));
          // Error Messages
          Object.assign(errorMessage, {'pattern': constraints[key].message});
          break;
        default:
          console.log(
            `${key.toUpperCase()} is not a constraint, that it's known in this form:
             \\src\\lib\\exportable\\dynamic-form\\controls\\form-control.service.ts:171`
          );
      }
    });
    if (required) {
      // Validators
      validatorsArray.push(Validators.required);
      // Error Message Language
      let errorMessageLang: string, lang: string;
      for (lang in localStorage) {
        // noinspection TsLint
        if (lang.match(/lang/gi)) errorMessageLang = localStorage.getItem(lang);
      }
      // Error Messages
      Object.assign(errorMessage, {
        'required': errorMessageLang === 'en' ? 'This field is required!' :
          errorMessageLang === 'sq' ? 'Kjo fushë është e detyrueshme!' :
            'Questo campo è obbligatorio!'
      });
    }
    if (field.customValidators) {
      field.customValidators.forEach(customValidator => validatorsArray.push(customValidator));
    }
    field.errorMessages = errorMessage;
    return validatorsArray;
  }
}
