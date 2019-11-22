import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FilterControlService} from '../controls/filter-control.service';
import {FieldMapModel} from '../../../common/models/fieldMap.model';
import {ObjectType} from '../../../common/models/form-control.model';
import {FilterOrder} from '../models/filter-order';
import {FilterOrderConfig} from '../models/filter-order-config';

interface FilterChip {
  name: string;
  label: string;
  value: string;
  selectValue?: string;
  isDate?: boolean;
}

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

  filterLabel: string;
  selectValueCombo: string;

  filter: FormGroup;
  filterChipArray: FilterChip[] = [];
  filtersArray: FilterOrderConfig[] = [];

  constructor(private _fcs: FilterControlService) {}

  ngOnInit() {
    this._setFilterLabel();
    if (this.filterMap && this.order) {
      this._setExtra();
      this._getFilter();
      this._fgCreate();

      if (this.opened) {
        this.accordion.open();
      }
    }
  }

  private _setFilterLabel() {
    let lang: string, i: string;
    for (i in localStorage) {
      // noinspection TsLint
      if (i.match(/lang/gi)) lang = localStorage.getItem(i);
    } this.filterLabel = lang === 'sq' ? 'Filtrat' : lang === 'it' ? 'Filtri' : 'Filters';
  }

  private _setExtra() {
    Object.keys(this.order).forEach(key => Object.assign(this.filterMap[key], this.order[key]));
  }

  private _getFilter() {
    Object.keys(this.order).forEach(key => this.filtersArray.push(this.filterMap[key]));
  }

  private _fgCreate() {
    this.filter = this._fcs.create(this.filtersArray);
    this._consecutiveCheck();
    this._firstCheck();
  }

  private _firstCheck() {
    this._chipCreator(this.filter.value);
    this._returnFilter();
  }

  private _consecutiveCheck() {
    this.filter.valueChanges.subscribe(filter => {
      this._chipCreator(filter);
      this._returnFilter();
    });
  }

  private _chipCreator(filter) {
    Object.keys(filter).forEach((key) => {
      const chipIndex = this.filterChipArray.findIndex(chip => chip.name === key);
      if (typeof filter[key] === 'object') {
        // TODO: when is date_input_between
      } else {
        if (filter[key] !== '') {
          this._ifExist(filter, key, chipIndex);
        } else if (chipIndex !== -1) {
          this.filterChipArray.splice(chipIndex, 1);
        }
      }
    });
  }

  private _ifExist(filterForm, field, index) {
    const chip = {
      name: field,
      label: this.filterMap[field].fieldLabel,
      value: filterForm[field],
      selectValue: this.filterMap[field].inputType === 'COMBO_BOX' ? this.selectValueCombo : undefined,
      isDate: !!this.filterMap[field].inputType.match(/DATE/g)
    };
    this.filterMap[field].inputType === 'COMBO_BOX' ?
      setTimeout(() => this._populateChipArray(index, chip)) : this._populateChipArray(index, chip);
  }

  private _populateChipArray(index, chip) {
    index === -1 ? this.filterChipArray.push(chip) : this.filterChipArray[index] = chip;
  }

  private _returnFilter() {
    const filter = {};
    this.filterChipArray.forEach(chip => Object.assign(filter, {[chip.name]: chip.value}));
    this.returnFilters.emit(filter);
  }

  removeFilter(index) {
    const control = this.filterChipArray[index].name;
    this.filterChipArray.splice(index, 1);
    control.match(/\./g) ?
      (this.filter.controls[control.split('.')[0]] as FormGroup).controls[control.split('.')[1]].setValue('') :
      this.filter.controls[control].setValue('');
    this._returnFilter();
  }

  removeAllFilters() {
    this.filterChipArray = [];
    this._returnFilter();
    this.filter.reset();
  }
}
