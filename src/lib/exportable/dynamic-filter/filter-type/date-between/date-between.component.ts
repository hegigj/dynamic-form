import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {AbstractModel} from '../../../../common/models/abstract.model';
import {FilterOrderConfig} from '../../models/filter-order-config';
import {TimezonePipe} from '../../../../common/controls/timezone.pipe';

@Component({
  selector: 'app-date-between',
  templateUrl: './date-between.component.html',
  styleUrls: ['./date-between.component.css']
})
export class DateBetweenComponent implements OnInit {
  @Input() fg: FormGroup | FormArray;
  @Input() filter: FilterOrderConfig;
  @Input() filterChipArray: AbstractModel[];

  @Output() returnFilterChipArray = new EventEmitter();

  date: any;

  constructor() { }

  ngOnInit() {
    this.date = new DatePipe('en-GB');
  }


  addDate(e, control) {
    const timestamp = new TimezonePipe().transform(e.value);
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
