import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FormOrderConfig} from '../../models/form-order-config';
import {Methods} from '../../../../common/models/form-control.model';
import {AbstractModel} from '../../../../common/models/abstract.model';
import {map, startWith} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {ProviderService} from '../../../../common/controls/provider.service';

@Component({
  selector: 'app-combo-box-multi',
  templateUrl: './combo-box-multi.component.html',
  styleUrls: ['./combo-box-multi.component.css']
})
export class ComboBoxMultiComponent implements OnInit {
  @Input() fieldDataPool: any[];
  @Input() method: Methods;
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormOrderConfig;
  @Input() fg: FormGroup;

  params = {pageNo: 1, pageSize: -1};
  valueChanges: Subscription;
  errorMessages: string;

  selectLabel: string;
  selected: any[] = [];
  private _selectedId: string[] = [];
  options: Observable<AbstractModel[] | any>;

  constructor(private _frp: ProviderService) { }

  ngOnInit() {
    this._filledChips();
    this.fg.setControl('inputField', new FormControl());
    this.selectLabel = this.field.selectLabel ? this.field.selectLabel : this.field.fieldRestVal ? this.field.fieldRestVal : 'someLabel';
    this._filteredFields();
    this._checkForErrors();
  }

  private _filledChips() {
    if (this.field.value) {
      let someLabel: string[] | string | any;
      if (typeof this.field.value === 'object') {
        this._selectedId = this.field.value;
        this._selectedId.forEach((id) => {
          someLabel.push(this.field.fieldDataPool ?
                            this.field.fieldDataPool.list.find(sl => sl.id === id).someLabel :
                            this.fieldDataPool.find(sl => sl.id === id).someLabel
          );
        });
      } else {
        this._selectedId.push(this.field.value);
        if (this.field.selectValue) {
          someLabel = this.field.selectValue;
        } else {
          someLabel = this.field.fieldDataPool ?
            this.field.fieldDataPool.list.find(sl => sl.id === this.field.value).someLabel :
            this.fieldDataPool.find(sl => sl.id === this.field.value).someLabel;
        }
      }
      if (typeof this.field.value === 'object') {
        this._selectedId.forEach((id, i) => {
          this.selected.push({id: id, someLabel: someLabel[i]});
        });
      } else {
        this.selected.push({id: this._selectedId[0], someLabel: someLabel});
      }
    }
  }

  private _filteredFields() {
    if (this.field.methods === undefined || (this.field.methods && this.field.methods['keyup'] === undefined)) {
      this.options = this.fg.controls['inputField'].valueChanges.pipe(startWith(''), map(value => this._filter(value)));
    }
  }

  private _filter(value: string): AbstractModel[] | any {
    if (typeof value !== 'object') {
      const filter = value.toLowerCase();
      const label = this.selectLabel;
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
  }

  addSelection(option: any) {
    const selectedOption = option.option.value;
    this._selectedId.push(selectedOption.id);
    this.selected.push({id: selectedOption.id, someLabel: selectedOption[this.selectLabel]});
    this.fg.controls[this.field.fieldName].setValue(this._selectedId);
    this.fg.controls['inputField'].setValue(null);
  }

  removeSelection(index) {
    this.selected.splice(index, 1);
    this._selectedId.splice(index, 1);
    this.fg.controls[this.field.fieldName].setValue(this._selectedId);
  }

  keyup(value) {
    if (this.field.methods && this.field.methods['keyup']) {
      this.field.methods['keyup'](value);
    } else if (this.field.fieldRestPool) {
      this._frp.fieldRestPool(this.field.svc, this.field.fieldRestPool, this.field.fieldRestVal, value, {paramBean: this.params})
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

  private _checkForErrors() {
    this.valueChanges = this.fg.controls[this.field.fieldName].valueChanges.subscribe(() => {
      if (this.fg.controls[this.field.fieldName].errors) {
        this.errorMessages = '';
        Object.keys(this.fg.controls[this.field.fieldName].errors).forEach((key) => {
          if (this.field.errorMessages && this.field.errorMessages[key]) {
            this.errorMessages = this.field.errorMessages[key];
          }
        });
      } else {
        this.errorMessages = '';
      }
    });
  }
}
