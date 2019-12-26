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
  method?: string | 'POST' | 'PUT';
}

@Injectable()
export class FormControlService {
  private _order: FormOrder;
  private _form: FormGroup;
  private _fieldArray: Field;
  private _formArray: FormArray;

  private _formValidity: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private _formBuilder: FormBuilder) {}

  setTimestamp$(control: {fieldName: string, isArray?: number}, timestamp: {date?: string, time?: string}): void {
    const date: string = timestamp.date;
    const time: string = timestamp.time;
    let oldDate: string, oldTime: string;
    let formControl: AbstractControl = this._form.controls[control.fieldName];
    if (control.isArray >= 0) {
      formControl = (<FormArray>formControl).at(control.isArray);
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
    if (order) {
      this._order = order;
    }
    if (validity) {
      this._formValidity.next(validity);
    }
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

  get form$() {
    if (this._form) {
      return this._form.value;
    } else {
      return {};
    }
  }

  get formValidity$(): Observable<string> {
    return this._formValidity.asObservable();
  }

  public deleteFormArray(index: number) {
    this._formArray.removeAt(index);
  }

  public addFormArray(index?: number, field?: Field) {
    if (index) {
      this._formArray.length > (index + 1) ?
        this._formArray.insert(index + 1, this._formArrayForm(field ? field : this._fieldArray)) :
        this._formArray.push(this._formArrayForm(field ? field : this._fieldArray));
    } else {
      this._formArray.push(this._formArrayForm(field ? field : this._fieldArray));
    }
  }

  public create(fields: FormOrderConfig[], method?: string) {
    const formGroup = this._fgCreator(fields, method);
    return new FormGroup(formGroup);
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
                this._formArrayControl(value, disabled, this._validators(field, field.constraintList, field.required))
              ) : field.inputType.match(/TABLE/g) ?
              this._formBuilder.array(
                  [this._formArrayForm({field: field.childFieldMeta, order: field.childField, method: method})]
              ) : new FormControl(
                {value: value, disabled: disabled},
                this._setValidator(field, method) ? [] : this._validators(field, field.constraintList, field.required)
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
    Object.keys(field.order ? field.order : field.field).forEach((key) => {
      if (field.order) {
        // noinspection TsLint
        if (field.order[key].value !== undefined) hasValue = true;
        Object.assign(field.field[key], field.order[key]);
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

  private _setValidator(field: FormOrderConfig, method?: string): boolean {
    return (field.fieldName === 'id' && method === 'POST');
  }

  private _validators(field: FormOrderConfig, constraints: Constraint, required?: boolean) {
    const validatorsArray = [];
    const errorMessage: ObjectType = {};
    const timestampPattern = '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}';
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
          required = false;
          // Error Messages
          Object.assign(errorMessage, {'required': constraints[key].message});
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
          validatorsArray.push(
            Validators.pattern(constraints[key].regexp.match(/yyyy-MM-dd'T'HH:mm:ss/g) ? timestampPattern : constraints[key].regexp)
          );
          // Error Messages
          Object.assign(errorMessage, {'pattern': constraints[key].message});
          break;
        default:
          console.log(
            `${key.toUpperCase()} is not a constraint, that it's known in this form:
             \\src\\lib\\exportable\\dynamic-form\\controls\\form-control.service.ts:214`
          );
      }
    });
    if (required) {
      // Validators
      validatorsArray.push(Validators.required);
      // Error Messages
      let errorMessageLang: string, i: string;
      for (i in localStorage) {
        if (i.match(/lang/gi)) {
          errorMessageLang = localStorage.getItem(i);
        }
      }
      Object.assign(errorMessage, {
        'required': errorMessageLang === 'en' ? 'This field is required' :
          errorMessageLang === 'it' ? 'Questo campo è obbligatorio' :
            'Kjo fushë është e detyrueshme'
      });
    }
    if (field.customValidators) {
      field.customValidators.forEach(customValidator => validatorsArray.push(customValidator));
    }
    field.errorMessages = errorMessage;
    return validatorsArray;
  }
}
