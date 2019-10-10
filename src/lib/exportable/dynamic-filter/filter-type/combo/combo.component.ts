import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ProviderService} from '../../../../common/controls/provider.service';
import {AbstractModel} from '../../../../common/models/abstract.model';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FilterOrderConfig} from '../../models/filter-order-config';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.css']
})
export class ComboComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() filter: FilterOrderConfig;
  @Input() fieldDataPool: AbstractModel[];
  @Input() filterChipArray: AbstractModel[];

  @Output() returnFilterChipArray = new EventEmitter();

  options: Observable<AbstractModel[] | any>;

  params = {pageNo: 1, pageSize: -1};

  selectLabel = '';
  select = '';

  constructor(public _frp: ProviderService) { }

  ngOnInit() {
    this.selectLabel = this.filter.selectLabel ? this.filter.selectLabel : this.filter.fieldRestVal ? this.filter.fieldRestVal : 'someLabel';
    this._filteredFilters();
  }

  private _filteredFilters() {
    if (this.filter.methods === undefined || (this.filter.methods && this.filter.methods['keyup'] === undefined)) {
      this.options = this.fg.controls[this.filter.fieldName].valueChanges.pipe(startWith(''), map(value => this._filter(value)));
    }
  }

  private _filter(value: any): AbstractModel[] | any {
    const filter = value.toLowerCase();
    const someLabel = this.filter.selectLabel ? this.filter.selectLabel : this.filter.fieldRestVal ? this.filter.fieldRestVal : 'someLabel';
    if (this.filter.fieldDataPool) {
      return this.filter.fieldDataPool.list.filter(opt => {
        return opt[someLabel].toLowerCase().includes(filter);
      });
    } else if (this.fieldDataPool) {
      return this.fieldDataPool.filter(opt => {
        return opt[someLabel].toLowerCase().includes(filter);
      });
    }
  }

  setLabel(option) {
    if (this.selectLabel.match(/[a-zA-z_]+\s[a-zA-z_]+/g)) {
      this.select = `${option[this.selectLabel.split(' ')[0]]} ${option[this.selectLabel.split(' ')[1]]}`;
    } else if (this.selectLabel.match(/\./g)) {
      this.select = option[this.selectLabel.split('.')[0]][this.selectLabel.split('.')[1]];
    } else {
      this.select = option[this.selectLabel];
    }
  }

  addSelectFilter(option) {
    this.setLabel(option);
    this._ifExist(this.select);
    this.returnFilterChipArray.emit(this.filterChipArray);
  }

  selectFilterValue() {
    const index = this.filterChipArray.findIndex(filter => filter.id === this.filter.fieldName);
    return this.filterChipArray[index] ? this.filterChipArray[index].someLabel : '';
  }

  private _ifExist(value) {
    let changed = false, index = 0;
    this.filterChipArray.forEach((object: AbstractModel, i: number) => {
      if (object.id === this.filter.fieldName) { changed = !(changed); index = i; }
    });
    changed ?
      this.filterChipArray[index] = {id: this.filter.fieldName, someLabel: value} :
      this.filterChipArray.push({id: this.filter.fieldName, someLabel: value});
  }

  keyup(e) {
    if (this.filter.methods && this.filter.methods['keyup']) {
      this.filter.methods['keyup'](e);
    } else if (this.filter.fieldRestPool) {
      this._frp.fieldRestPool(this.filter.svc, this.filter.fieldRestPool, this.filter.fieldRestVal, e, {paramBean: this.params})
        .subscribe((res: any) => this.fieldDataPool = res.list);
    }
  }

  change() {
    if (this.filter.methods && this.filter.methods['change']) {
      this.filter.methods['change']();
    }
  }

  focus() {
    if (this.filter.methods && this.filter.methods['focus']) {
      this.filter.methods['focus']();
    } else if (this.filter.fieldRestPool) {
      this._setOtherParams();
      this._frp.fieldRestPool(this.filter.svc, this.filter.fieldRestPool, this.filter.fieldRestVal, '', {paramBean: this.params})
        .subscribe((res: any) => this.fieldDataPool = res.list);
    }
  }

  private _setOtherParams() {
    if (this.filter.fieldDependsOn) {
      this.filter.fieldDependsOn.forEach((fieldDependsOn) => {
        Object.assign(this.params, {[fieldDependsOn]: this.fg.controls[fieldDependsOn].value});
      });
    }
  }
}
