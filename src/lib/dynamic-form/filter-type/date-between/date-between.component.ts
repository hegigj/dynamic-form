import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormControlModel} from '../../models/form-control.model';
import {AbstractModel} from '../../models/abstract.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-date-between',
  templateUrl: './date-between.component.html',
  styleUrls: ['./date-between.component.css']
})
export class DateBetweenComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() filter: FormControlModel;
  @Input() filterChipArray: AbstractModel[];

  @Output() returnFilterChipArray = new EventEmitter();

  date: any;

  constructor() { }

  ngOnInit() {
    this.date = new DatePipe('en-GB');
  }


  addDate(e, control) {
    const date = new Date(new Date(e.value).valueOf() + 8.64e+7).toISOString().split('.')[0];
    const timestamp = `${date.split('T')[0]}T00:00:00`;
    (this.fg.controls[this.filter.fieldName] as FormGroup).controls[control].setValue(timestamp);
    this._ifExist(timestamp, control);
    this.returnFilterChipArray.emit(this.filterChipArray);
  }

  private _ifExist(value, control) {
    let changed = false, index = 0;
    this.filterChipArray.forEach((object: AbstractModel, i: number) => {
      if (object.id === this.filter.fieldName) { changed = !(changed); index = i; }
    });
    !changed ?
      this.filterChipArray.push({id: `${this.filter.fieldName}.${control}`, someLabel: this.date.transform(value, 'MMM dd yyyy')}) :
      this.filterChipArray[index] = {id: `${this.filter.fieldName}.${control}`, someLabel: this.date.transform(value, 'MMM dd yyyy')};
  }
}
