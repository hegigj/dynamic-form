import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormOrderConfig} from '../../models/form-order-config';
import {ObjectType} from '../../../../common/models/form-control.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-decimal-input',
  templateUrl: './decimal-input.component.html',
  styleUrls: ['./decimal-input.component.css']
})
export class DecimalInputComponent implements OnInit, OnDestroy {
  @Input() notId: boolean;
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormOrderConfig;
  @Input() fg: FormGroup;

  valueChanges: Subscription;
  errorMessages: string;
  constructor() { }

  ngOnInit() {
    this._checkForErrors();
  }

  ngOnDestroy() {
    this.valueChanges.unsubscribe();
  }

  private _checkForErrors() {
    this.valueChanges = this.fg.controls[this.field.fieldName].valueChanges.subscribe(() => {
      if (this.fg.controls[this.field.fieldName].errors) {
        this.errorMessages = '';
        Object.keys(this.fg.controls[this.field.fieldName].errors).forEach((key) => {
          if (this.field.errorMessages && this.field.errorMessages[key]) {
            this.errorMessages = this.field.errorMessages[key];
          }
        });
      } else {
        this.errorMessages = '';
      }
    });
  }
}
