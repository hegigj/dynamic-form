import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormOrderConfig} from '../../models/form-order-config';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit, OnDestroy {
  @Input() notId: boolean;
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormOrderConfig;
  @Input() fg: FormGroup;

  valueChanges: Subscription;
  errorMessages: string[] = [];
  constructor() { }

  ngOnInit() {
    this._checkForErrors();
  }

  ngOnDestroy() {
    this.valueChanges.unsubscribe();
  }

  private _checkForErrors() {
    this.valueChanges = this.fg.controls[this.field.fieldName].valueChanges.subscribe(() => {
      if (this.field.errorMessages) {
        if (this.fg.controls[this.field.fieldName].errors) {
          Object.keys(this.fg.controls[this.field.fieldName].errors).forEach((key) => {
            if (this.errorMessages.indexOf(this.field.errorMessages[key]) === -1) {
              this.errorMessages.push(this.field.errorMessages[key]);
            }
          });
        } else {
          this.errorMessages = [];
        }
      }
    });
  }
}
