import {Injectable} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Constraint, ObjectType} from '../../../common/models/form-control.model';
import {FormOrderConfig} from '../models/form-order-config';
import {FormOrder} from '../models/form-order';
import {BehaviorSubject, Observable} from 'rxjs';
import {TimezonePipe} from '../../../common/controls/timezone.pipe';
import {FieldMapModel} from '../../../common/models/fieldMap.model';

@Injectable()
export class FormControlService {
  private _order: FormOrder;
  private _form: FormGroup;
  private _formArray: FormArray;

  private _formValidity: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private _formBuilder: FormBuilder) {}

  setTimestamp$(control: {fieldName: string, isArray?: number}, timestamp: {date?: string, time?: string}): void {
    let date: string = timestamp.date;
    let time: string = timestamp.time;
    let formControl: AbstractControl = this._form.controls[control.fieldName];
    if (control.isArray >= 0) {
      formControl = (<FormArray>formControl).at(control.isArray);
    }

    if (date && time) {
      formControl.setValue(`${date}T${time}`);
    } else if (date) {
      if (formControl.value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g)) {
        time = formControl.value.split('T')[1];
        formControl.setValue(`${date}T${time}`);
      } else {
        formControl.setValue(`${date}T00:00:00`);
      }
    } else if (time) {
      if (formControl.value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g)) {
        date = formControl.value.split('T')[0];
        formControl.setValue(`${date}T${time}`);
      } else {
        formControl.setValue(`${new TimezonePipe().transform(new Date()).split('T')[0]}T${time}`);
      }
    } else {
      formControl.setValue('');
    }
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

  public create(fields: FormOrderConfig[], method?: string) {
    const formGroup = this._fgCreator(fields, method);
    return new FormGroup(formGroup);
  }

  private _fgCreator(fields: FormOrderConfig[], method?: string) {
    const fg: any = {};
    fields.forEach((field) => {
      const value = field.value ? field.value : '';
      const disabled = field.disabled !== undefined ? field.disabled :
        method === 'POST' ? !field.canPost :
          method === 'PUT' ? !field.canPut :
            true;

      if (field.canGet) {
        Object.assign(fg,
          {
            [field.fieldName]: field.inputType.match(/AREA/g) ?
              new FormArray(
                this._formArrayControl(value, disabled, this._validators(field, field.constraintList, field.required))
              ) : field.inputType.match(/TABLE/g) ?
              this._formBuilder.array(
                  [this._formArrayForm(field.childFieldMeta, field.childField, method)]
              ) : new FormControl(
                {value: value, disabled: disabled},
                this._setValidator(field, method) ? [] : this._validators(field, field.constraintList, field.required)
              )
          }
        );
      }
    });
    return fg;
  }

  private _formArrayForm(field: FieldMapModel, order?: FormOrderConfig, method?: string): FormGroup {
    const fieldArray: FormOrderConfig[] = [];
    Object.keys(order ? order : field).forEach(key => {
      if (order) {
        Object.assign(field[key], order[key]);
      } fieldArray.push(field[key]);
    });
    const form = this._fgCreator(fieldArray, method);
    return this._formBuilder.group(form);
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
          validatorsArray.push(Validators.required); required = false;
          // Error Messages
          Object.assign(errorMessage, {'required': constraints[key].message});
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
          console.log(`${key.toUpperCase()} is not a constraint, that it's known in this form`);
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
    } if (field.customValidators) {
      field.customValidators.forEach(customValidator => validatorsArray.push(customValidator));
    } field.errorMessages = errorMessage;
    return validatorsArray;
  }
}
