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

  @Output() returnSelection = new EventEmitter<{id: string, selected: string}>();

  options: Observable<AbstractModel[] | any>;

  params = {pageNo: 1, pageSize: -1};
  selectLabel = '';
  selected = '';

  constructor(public _frp: ProviderService) { }

  ngOnInit() {
    this.selectLabel = this.filter.selectLabel ? this.filter.selectLabel : this.filter.fieldRestVal ? this.filter.fieldRestVal : 'someLabel';
    this._filteredFilters();
    this._filledField();
  }

  private _filledField() {
    if (this.filter.value) {
      if (this.filter.selectValue === undefined) {
        this.filter.selectValue = this.filter.fieldDataPool && this.filter.fieldDataPool.list ?
          this.filter.fieldDataPool.list.find(sv => sv.id === this.filter.value)[this.selectLabel] :
          this.fieldDataPool ? this.fieldDataPool.find(sv => sv.id === this.filter.value)[this.selectLabel] : undefined;
      }
      this.returnSelection.emit({id: this.filter.value, selected: this.filter.selectValue});
      setTimeout(() => this.selected = this.filter.selectValue ? this.filter.selectValue : this.filter.value);
    }
  }

  private _filteredFilters() {
    if (this.filter.methods === undefined || (this.filter.methods && this.filter.methods['keyup'] === undefined)) {
      this.options = this.fg.controls[this.filter.fieldName].valueChanges.pipe(startWith(''), map(value => this._filter(value)));
    }
  }

  private _filter(value: any): AbstractModel[] | any {
    const filter = value.toLowerCase();
    const someLabel = this.selectLabel;
    if (this.filter.fieldDataPool && this.filter.fieldDataPool.list) {
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
    if (typeof option === 'object') {
      this.selected = '';
      const selected = this.selectLabel.match(/\s/g) ?
                        `${option[this.selectLabel.split(' ')[0]]} ${option[this.selectLabel.split(' ')[1]]}` :
                        this.selectLabel.match(/\./g) ?
                          option[this.selectLabel.split('.')[0]][this.selectLabel.split('.')[1]] :
                          option[this.selectLabel];
      this.returnSelection.emit({id: option.id, selected: selected});
      setTimeout(() => this.selected = selected);
    } else {
      this.selected = option;
    }
  }

  keyup(value) {
    if (this.filter.methods && this.filter.methods['keyup']) {
      this.filter.methods['keyup'](value);
    } else if (this.filter.fieldRestPool) {
      this._frp.fieldRestPool(this.filter.svc, this.filter.fieldRestPool, this.filter.fieldRestVal, value, {paramBean: this.params})
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
