import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AmazingTimePickerService} from 'amazing-time-picker-angular6';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {FormOrderConfig} from '../../models/form-order-config';
import {Subscription} from 'rxjs';
import {TimezonePipe} from '../../../../common/controls/timezone.pipe';
import {FormControlService} from '../../controls/form-control.service';

@Component({
  selector: 'app-date-input-area',
  templateUrl: './date-input-area.component.html',
  styleUrls: ['./date-input-area.component.css']
})
export class DateInputAreaComponent implements OnInit, OnDestroy {
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormOrderConfig;
  @Input() fg: FormGroup;

  i: number;
  index: number;

  valueChanges: Subscription;
  errorMessages: string;

  DISPLAY__TIME_PICKER: boolean;
  addNewDateLabel: string;

  constructor(private _atp: AmazingTimePickerService,
              private _fcs: FormControlService) {}

  ngOnInit() {
    this.index = this.fg.controls[this.field.fieldName].value.length - 1;
    this.i = this.index;
    this._displayTP();
    this.checkFormArray();
    this._checkForErrors();
    this._setAddNewDateLabel();
  }

  ngOnDestroy() {
    this.valueChanges.unsubscribe();
  }

  private _setAddNewDateLabel() {
    let labelLang: string, lang: string;
    for (lang in localStorage) {
      // noinspection TsLint
      if (lang.match(/lang/gi)) labelLang = localStorage.getItem(lang);
    }
    this.addNewDateLabel = labelLang === 'en' ? 'ADD NEW DATE' : labelLang === 'sq' ? 'SHTO DATÉ TÉ RE' : 'AGGIUNGI NUOVA DATE';
  }

  openDP(dp, index) {
    this.i = index;
    dp.open();
  }

  addDate(e) {
    const date = new TimezonePipe().transform(e.value);
    this._fcs.setTimestamp$(
      {
        fieldName: this.field.fieldName,
        isArray: this.index !== this.i ? this.i : this.index
      },
      {
        date: date.split('T')[0]
      }
    );
    this._openDatePickerAndTimePickerSimultaneously();
  }

  addTime(index) {
    this.i = index;
    this._atp.open(this.field.timePickerFormat ? this.field.timePickerFormat : {theme: 'light'}).afterClose().subscribe(time => {
      this._fcs.setTimestamp$(
        {
          fieldName: this.field.fieldName,
          isArray: this.index !== this.i ? this.i : this.index
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
      this.addTime(this.index !== this.i ? this.i : this.index);
    }
  }

  checkFormArray() {
    if (this.index >= 0) {
      const formArrayControl = (<FormArray>this.fg.controls[this.field.fieldName]).at(this.index);
      return formArrayControl.value === '';
    } else if (this.index < 0) {
      return false;
    }
  }

  addNew() {
    this.index ++;
    const formArrayControl = this.fg.controls[this.field.fieldName] as FormArray;
    const formArrayValidators = formArrayControl.at(this.index - 1).validator;
    formArrayControl.push(new FormControl({value: '', disabled: this.field.disabled}, formArrayValidators));
  }

  removeNew(index) {
    const formArrayControl = this.fg.controls[this.field.fieldName] as FormArray;
    formArrayControl.removeAt(index);
    this.index --;
  }

  private _checkForErrors() {
    const formArrayControl = (<FormArray>this.fg.controls[this.field.fieldName]).at(this.index !== this.i ? this.i : this.index);
    this.valueChanges = formArrayControl.valueChanges.subscribe(() => {
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
