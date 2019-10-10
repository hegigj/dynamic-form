import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FilterControlService} from '../controls/filter-control.service';
import {FieldMapModel} from '../../../common/models/fieldMap.model';
import {ObjectType} from '../../../common/models/form-control.model';
import {AbstractModel} from '../../../common/models/abstract.model';
import {FilterOrder} from '../models/filter-order';
import {FilterOrderConfig} from '../models/filter-order-config';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @ViewChild('filtersAccordion') accordion: any;
  @Input() filterMap: FieldMapModel;
  @Input() order: FilterOrder;
  @Input() fieldDataPool: any[];
  @Input() opened: boolean;

  @Output() returnFilters = new EventEmitter<ObjectType>();

  filter: FormGroup;
  filterChipArray: AbstractModel[] = [];
  filtersArray: FilterOrderConfig[] = [];

  constructor(private _fcs: FilterControlService) {}

  ngOnInit() {
    if (this.filterMap && this.order) {
      this._setExtra();
      this._getFilter();
      this._fgCreate();

      if (this.opened) {
        this.accordion.open();
      }
    }
  }

  private _getFilter() {
    Object.keys(this.order).forEach((order) => {
      Object.keys(this.filterMap).forEach((key) => { if (key === order) { this.filtersArray.push(this.filterMap[key]); }});
    });
  }

  private _setExtra() {
    if (this.order) {
      Object.keys(this.order).forEach((key) => {
        if (this.order[key]) {
          Object.assign(this.filterMap[key], this.order[key]);
        }
      });
    }
  }

  private _fgCreate() {
    this.filter = this._fcs.create(this.filtersArray);
  }

  _returnFilters(filterChipArray?) {
    const filters = {};
    const controls = this.filter.value;
    if (filterChipArray) { this.filterChipArray = filterChipArray; }
    Object.keys(controls).forEach((key) => {
      if (controls[key] !== null && controls[key] !== undefined && controls[key] !== '') {
        Object.assign(filters, {[key]: controls[key]});
      }
    }); this.returnFilters.emit(filters);
  }

  removeFilter(index, control) {
    this.filterChipArray.splice(index, 1);
    control.match(/\./g) ?
      (this.filter.controls[control.split('.')[0]] as FormGroup).controls[control.split('.')[1]].setValue('') :
      this.filter.controls[control].setValue('');
    this._returnFilters();
  }

  removeAllFilters() {
    this.filterChipArray = [];
    this.filter.reset();
    this._returnFilters();
  }
}
