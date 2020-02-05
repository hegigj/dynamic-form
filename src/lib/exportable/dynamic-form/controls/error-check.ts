import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {Input} from "@angular/core";
import {FormOrderConfig} from "../models/form-order-config";
import {FormGroup} from "@angular/forms";

export class ErrorCheck {
  @Input()
  set field(value: FormOrderConfig) {
    this._field = value;
    this._checkForErrors();
  }

  @Input() fg: FormGroup;
  @Input() appearance: string;

  private _field: FormOrderConfig;
  private _valueChange: Subscription;
  private _errorMessage: BehaviorSubject<string>;

  constructor() {
    this._errorMessage = new BehaviorSubject<string>('');
  }

  get field(): FormOrderConfig {
    return this._field;
  }

  get errorMessage(): Observable<string> {
    return this._errorMessage.asObservable();
  }

  unsubscribe(): void {
    this._valueChange.unsubscribe();
  }

  private _checkForErrors(): void {
    this._valueChange = this.fg.controls[this.field.fieldName].valueChanges.subscribe(() => {
      if (this.fg.controls[this.field.fieldName].errors) {
        Object.keys(this.fg.controls[this.field.fieldName].errors).forEach(key => this._setErrorMessage(key));
      } else {
        this._resetErrorMessage();
      }
    });
  }

  private _resetErrorMessage(): void {
    this._errorMessage.next('');
  }

  private _setErrorMessage(key: string): void {
    if (this.field && this.field.errorMessages) {
      this.field.errorMessages[key] ? this._errorMessage.next(this.field.errorMessages[key]) : NaN;
    }
  }
}
