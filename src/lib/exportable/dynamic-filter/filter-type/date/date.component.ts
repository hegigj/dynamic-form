import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {AbstractModel} from '../../../../common/models/abstract.model';
import {FilterOrderConfig} from '../../models/filter-order-config';
import {TimezonePipe} from '../../../../common/controls/timezone.pipe';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() filter: FilterOrderConfig;
  @Input() filterChipArray: AbstractModel[];

  @Output() returnFilterChipArray = new EventEmitter();

  date: any;

  constructor() { }

  ngOnInit() {
    this.date = new DatePipe('en-GB');
  }

  addDate(e) {
    const timestamp = new TimezonePipe().transform(e);
    this.fg.controls[this.filter.fieldName].setValue(timestamp);
    this._ifExist(timestamp);
    this.returnFilterChipArray.emit(this.filterChipArray);
  }

  private _ifExist(value) {
    let changed = false, index = 0;
    this.filterChipArray.forEach((object: AbstractModel, i: number) => {
      if (object.id === this.filter.fieldName) { changed = !(changed); index = i; }
    });
    !changed ?
      this.filterChipArray.push({id: this.filter.fieldName, someLabel: this.date.transform(value, 'MMM dd yyyy')}) :
      this.filterChipArray[index] = {id: this.filter.fieldName, someLabel: this.date.transform(value, 'MMM dd yyyy')};
  }
}
