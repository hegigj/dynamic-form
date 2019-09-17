import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AbstractModel} from '../../../models/abstract.model';
import {FilterOrderConfig} from '../../models/filter-order-config';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() filter: FilterOrderConfig;
  @Input() filterChipArray: AbstractModel[];

  @Output() returnFilterChipArray = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  addKeyUpFilter(value) {
    this.keyup(value);
    this._ifExist(value);
    this.returnFilterChipArray.emit(this.filterChipArray);
  }

  private _ifExist(value) {
    let changed = false, index = 0;
    this.filterChipArray.forEach((object: AbstractModel, i: number) => {
      if (object.id === this.filter.fieldName) { changed = !(changed); index = i; }
    });
    !changed ?
      this.filterChipArray.push({id: this.filter.fieldName, someLabel: value}) :
      this.filterChipArray[index] = {id: this.filter.fieldName, someLabel: value};
  }

  keyup(e) {
    if (this.filter.methods && this.filter.methods['keyup']) {
      this.filter.methods['change'](e);
    }
  }

  change() {
    if (this.filter.methods && this.filter.methods['change']) {
      this.filter.methods['change']();
    }
  }
}
