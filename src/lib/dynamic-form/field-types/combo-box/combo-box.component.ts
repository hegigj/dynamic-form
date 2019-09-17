import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ProviderService} from '../../../controls/provider.service';
import {Observable} from 'rxjs';
import {AbstractModel} from '../../../models/abstract.model';
import {map, startWith} from 'rxjs/operators';
import {FormOrderConfig} from '../../models/form-order-config';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit {
  @Input() fieldDataPool: AbstractModel[] | any;
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormOrderConfig;
  @Input() fg: FormGroup;

  options: Observable<AbstractModel[] | any>;

  params = {pageNo: 1, pageSize: -1};

  selectLabel = '';
  select = '';

  constructor(private _frp: ProviderService) { }

  ngOnInit() {
    this.selectLabel = this.field.selectLabel ? this.field.selectLabel : this.field.fieldRestVal ? this.field.fieldRestVal : 'someLabel';
    if (this.field.selectValue) {
      setTimeout(() => this.select = this.field.selectValue);
    } this._filteredFields();
  }

  private _filteredFields() {
    if (this.field.methods === undefined || (this.field.methods && this.field.methods['keyup'] === undefined)) {
      this.options = this.fg.controls[this.field.fieldName].valueChanges.pipe(startWith(''), map(value => this._filter(value)));
    }
  }

  private _filter(value: AbstractModel[] | any): AbstractModel[] | any {
    const filter = value.toLowerCase();
    const label = this.field.autocompleteLabel ?
      this.field.autocompleteLabel : this.field.fieldRestVal ? this.field.fieldRestVal : 'someLabel';
    if (this.field.fieldDataPool) {
      return this.field.fieldDataPool.list.filter(opt => {
        return opt[label].toLowerCase().includes(filter);
      });
    } else if (this.fieldDataPool) {
      return this.fieldDataPool.filter(opt => {
        return opt[label].toLowerCase().includes(filter);
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

  keyup(e) {
    if (this.field.methods && this.field.methods['keyup']) {
      this.field.methods['keyup'](e);
    } else if (this.field.fieldRestPool) {
      this._frp.fieldRestPool(this.field.svc, this.field.fieldRestPool, this.field.fieldRestVal, e, {paramBean: this.params})
        .subscribe((res: any) => this.fieldDataPool = res.list);
    }
  }

  change() {
    if (this.field.methods && this.field.methods['change']) {
      this.field.methods['change']();
    }
  }

  focus() {
    if (this.field.methods && this.field.methods['focus']) {
      this.field.methods['focus']();
    } else if (this.field.fieldRestPool) {
      this._setOtherParams();
      this._frp.fieldRestPool(this.field.svc, this.field.fieldRestPool, this.field.fieldRestVal, '', {paramBean: this.params})
        .subscribe((res: any) => this.fieldDataPool = res.list);
    }
  }

  private _setOtherParams() {
    if (this.field.fieldDependsOn) {
      this.field.fieldDependsOn.forEach((fieldDependsOn) => {
        Object.assign(this.params, {[fieldDependsOn]: this.fg.controls[fieldDependsOn].value});
      });
    }
  }
}
