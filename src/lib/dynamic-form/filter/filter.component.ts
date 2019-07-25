import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FieldMapModel} from '../models/fieldMap.model';
import {FormControlModel, ObjectType} from '../models/form-control.model';
import {FormGroup} from '@angular/forms';
import {AbstractModel} from '../models/abstract.model';
import {FieldOrderModel} from '../models/field-order.model';
import {FilterControlService} from '../controls/filter-providers/filter-control.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() filterMap: FieldMapModel;
  @Input() fieldDataPool: any[];
  @Input() order: FieldOrderModel;

  @Output() returnFilters = new EventEmitter<ObjectType>();

  filter: FormGroup;
  filterChipArray: AbstractModel[] = [];
  filtersArray: FormControlModel[] = [];

  constructor(private _fcs: FilterControlService) { }

  ngOnInit() {
    if (this.filterMap && this.order) {
      this._setExtra();
      this._getFilter();
      this._fgCreate();
    }
  }

  private _getFilter() {
    Object.keys(this.order).forEach((order) => {
      Object.keys(this.filterMap).forEach((key) => { if (key === order) { this.filtersArray.push(this.filterMap[key]); }});
    });
  }

  private _setExtra() {
    Object.keys(this.order).forEach((key) => {
      if (this.order[key].selectLabel) {
        Object.assign(this.filterMap[key], {selectLabel: this.order[key].selectLabel});
      }
      if (this.order[key].svc) {
        Object.assign(this.filterMap[key], {svc: this.order[key].svc});
      }
    });
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
