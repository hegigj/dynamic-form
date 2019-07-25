import {Component, Input, OnInit} from '@angular/core';
import {FormControlModel} from '../../models/form-control.model';
import {FormGroup} from '@angular/forms';
import {AmazingTimePickerService} from 'amazing-time-picker-angular6';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements OnInit {
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormControlModel;
  @Input() fg: FormGroup;

  date: string;
  time: string;

  constructor(private _atp: AmazingTimePickerService) { }

  ngOnInit() {}

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
    this.fg.controls[this.field.fieldName].setValue(timestamp);
  }

}
