import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {FilterOrderConfig} from '../../models/filter-order-config';
import {TimezonePipe} from '../../../../common/controls/timezone.pipe';
import {FilterControlService} from '../../controls/filter-control.service';
import {AmazingTimePickerService} from 'amazing-time-picker-angular6';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() filter: FilterOrderConfig;

  date: any;

  constructor(private _fcs: FilterControlService,
              private _atp: AmazingTimePickerService) { }

  ngOnInit() {
    this.date = new DatePipe('en-GB');
  }

  openDP(control) {
    control.open();
  }

  addDate(e) {
    const date = new TimezonePipe().transform(e.value);
    this._fcs.setTimestamp$(
      {
        fg: this.fg,
        fieldName: this.filter.fieldName
      },
      {
        date: date.split('T')[0]
      }
    );
    this.addTime();
  }

  addTime() {
    this._atp.open({theme: 'light'}).afterClose().subscribe((time: any) => {
      this._fcs.setTimestamp$(
        {
          fg: this.fg,
          fieldName: this.filter.fieldName
        },
        {
          time: `${time}:00`
        }
      );
    });
  }
}
