import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AmazingTimePickerService} from 'amazing-time-picker-angular6';
import {FormOrderConfig} from '../../models/form-order-config';
import {Subscription} from 'rxjs';
import {TimezonePipe} from '../../../../common/controls/timezone.pipe';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements OnInit, OnDestroy {
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormOrderConfig;
  @Input() fg: FormGroup;

  valueChanges: Subscription;
  errorMessages: string[] = [];
  constructor(private _atp: AmazingTimePickerService) {}

  ngOnInit() {
    this._checkForErrors();
  }

  ngOnDestroy() {
    this.valueChanges.unsubscribe();
  }

  openDP(control) {
    control.open();
  }

  addDate(e) {
    const date = new TimezonePipe().transform(e.value);
    this._setTimestamp(date.split('T')[0]);
  }

  addTime() {
    this._atp.open({theme: 'light'}).afterClose().subscribe((time: any) => {
      this._setTimestamp(null, `${time}:00`);
    });
  }

  private _setTimestamp(date?, time?) {
    if (date && time) {
      this.fg.controls[this.field.fieldName].setValue(`${date}T${time}`);
    } else if (date) {
      if (this.fg.controls[this.field.fieldName].value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g)) {
        time = this.fg.controls[this.field.fieldName].value.split('T')[1];
        this.fg.controls[this.field.fieldName].setValue(`${date}T${time}`);
      } else {
        this.fg.controls[this.field.fieldName].setValue(`${date}T00:00:00`);
      }
    } else if (time) {
      if (this.fg.controls[this.field.fieldName].value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g)) {
        date = this.fg.controls[this.field.fieldName].value.split('T')[0];
        this.fg.controls[this.field.fieldName].setValue(`${date}T${time}`);
      } else {
        this.fg.controls[this.field.fieldName].setValue(`${new Date().toISOString().split('T')[0]}T${time}`);
      }
    } else {
      this.fg.controls[this.field.fieldName].setValue('');
    }
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
