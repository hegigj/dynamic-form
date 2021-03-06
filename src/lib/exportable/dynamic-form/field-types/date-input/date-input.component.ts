import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AmazingTimePickerService} from 'amazing-time-picker-angular6';
import {FormOrderConfig} from '../../models/form-order-config';
import {Subscription} from 'rxjs';
import {TimezonePipe} from '../../../../common/controls/timezone.pipe';
import {FormControlService} from '../../controls/form-control.service';

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
  errorMessages: string;

  DISPLAY__TIME_PICKER: boolean;

  constructor(private _atp: AmazingTimePickerService,
              private _fcs: FormControlService) {}

  ngOnInit() {
    this._checkForErrors();
    this._displayTP();
  }

  ngOnDestroy() {
    this.valueChanges.unsubscribe();
  }

  openDP(control) {
    control.open();
  }

  addDate(e) {
    const date = new TimezonePipe().transform(e.value);
    this._fcs.setTimestamp$(
      {
        fieldName: this.field.fieldName
      },
      {
        date: date.split('T')[0]
      }
    );
    this._openDatePickerAndTimePickerSimultaneously();
  }

  addTime() {
    this._atp.open(this.field.timePickerFormat ? this.field.timePickerFormat : {theme: 'light'}).afterClose().subscribe(time => {
      this._fcs.setTimestamp$(
        {
          fieldName: this.field.fieldName
        },
        {
          time: `${time}:00`
        }
      );
    });
  }

  private _displayTP() {
    if (this.field.displayTimePicker !== undefined) {
      this.DISPLAY__TIME_PICKER = this.field.displayTimePicker;
    } else if (this.field.dateFormat) {
      this.DISPLAY__TIME_PICKER = !!this.field.dateFormat.match(/HH:mm(:ss|)/g);
    } else {
      this.DISPLAY__TIME_PICKER = true;
    }
  }

  private _openDatePickerAndTimePickerSimultaneously() {
    if (this.DISPLAY__TIME_PICKER && (this.field.disableTimePicker === undefined || !this.field.disableTimePicker)) {
      this.addTime();
    }
  }

  private _checkForErrors() {
    this.valueChanges = this.fg.controls[this.field.fieldName].valueChanges.subscribe(() => {
      if (this.fg.controls[this.field.fieldName].errors) {
        this.errorMessages = '';
        Object.keys(this.fg.controls[this.field.fieldName].errors).forEach(key => {
          // noinspection TsLint
          if (this.field.errorMessages && this.field.errorMessages[key]) this.errorMessages = this.field.errorMessages[key];
        });
      } else {
        this.errorMessages = '';
      }
    });
  }
}
