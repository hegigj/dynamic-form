import {Component, Input, OnInit} from '@angular/core';
import {AmazingTimePickerService} from 'amazing-time-picker-angular6';
import {FormControlModel} from '../../models/form-control.model';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-date-input-area',
  templateUrl: './date-input-area.component.html',
  styleUrls: ['./date-input-area.component.css']
})
export class DateInputAreaComponent implements OnInit {
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormControlModel;
  @Input() fg: FormGroup;

  index: number;
  date: string;
  time: string;

  constructor(private _atp: AmazingTimePickerService) { }

  ngOnInit() {
    this.index = this.fg.controls[this.field.fieldName].value.length - 1;
  }

  addDate(e) {
    const fn = this.field.fieldName;
    const time = fn.match(/start/g) ? '08:00' : fn.match(/(stop|end)/g) ? '18:00' : '00:00';

    this.date = new Date(new Date(e.value).valueOf() + 8.64e+7).toISOString().split('.')[0];
    this.time = time;

    this._setTimestamp(`${this.date.split('T')[0]}T${this.time}:00`);
  }

  addTime() {
    this._atp.open({theme: 'light'}).afterClose().subscribe((time: any) => {
      this.time = time;
      this._setTimestamp(`${this.date.split('T')[0]}T${this.time}:00`);
    });
  }

  private _setTimestamp(timestamp) {
    const formArrayControl = (<FormArray>this.fg.controls[this.field.fieldName]).at(this.index);
    formArrayControl.setValue(timestamp);
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
    formArrayControl.push(new FormControl({value: '', disabled: this.field.disabled}));
  }

  removeNew(index) {
    const formArrayControl = this.fg.controls[this.field.fieldName] as FormArray;
    formArrayControl.removeAt(index);
    this.index --;
  }
}
