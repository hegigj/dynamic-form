import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ProviderService} from '../../../../common/controls/provider.service';
import {Observable, Subscription} from 'rxjs';
import {AbstractModel} from '../../../../common/models/abstract.model';
import {map, startWith} from 'rxjs/operators';
import {FormOrderConfig} from '../../models/form-order-config';
import {OptionPipe} from '../../../../common/controls/option.pipe';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit, OnDestroy {
  @Input() fg: FormGroup;
  @Input() field: FormOrderConfig;
  @Input() fieldDataPool: AbstractModel[] | any;
  @Input() display: boolean;
  @Input() appearance: string;

  options: Observable<AbstractModel[] | any[]>;
  params = {pageNo: 1, pageSize: -1};

  selectLabel = '';
  selected = '';

  statusChanges: Subscription;
  errorMessages: string;

  constructor(private _frp: ProviderService) { }

  ngOnInit() {
    this.selectLabel = this.field.selectLabel ? this.field.selectLabel : this.field.fieldRestVal ? this.field.fieldRestVal : 'someLabel';
    this._filteredFields();
    this._filledField();
    this._checkErrors();
  }

  ngOnDestroy() {
    this.statusChanges.unsubscribe();
  }

  private _filledField() {
    if (this.field.value) {
      setTimeout(() => {
        if (this.field.selectValue === undefined) {
          this.field.selectValue = new OptionPipe()
            .transform(
              (this.field.fieldDataPool ? this.field.fieldDataPool.list : this.fieldDataPool).find(sv => sv.id === this.field.value),
              this.selectLabel
            );
        }
        this.selected = this.field.selectValue ? this.field.selectValue : this.field.value;
      });
    }
  }

  private _filteredFields() {
    if (this.field.methods === undefined || (this.field.methods && this.field.methods['keyup'] === undefined)) {
      this.options = this.fg.controls[this.field.fieldName].valueChanges.pipe(startWith(''), map(value => this._filter(value)));
    }
  }

  private _filter(value: string): AbstractModel[] | any[] {
    const filter = value.toLowerCase();
    const label = this.field.autocompleteLabel ? this.field.autocompleteLabel :
      this.field.fieldRestVal ? this.field.fieldRestVal :
        'someLabel';
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

  private _setOtherParams() {
    if (this.field.fieldDependsOn) {
      this.field.fieldDependsOn
        .forEach(fieldDependsOn => Object.assign(this.params, {[fieldDependsOn]: this.fg.controls[fieldDependsOn].value}));
    }
  }

  private _checkErrors() {
    this.statusChanges = this.fg.controls[this.field.fieldName].statusChanges.subscribe(() => {
      if (this.fg.controls[this.field.fieldName].errors) {
        this.errorMessages = '';
        Object.keys(this.fg.controls[this.field.fieldName].errors).forEach(key => {
          // noinspection TsLint
          if (this.field.errorMessages && this.field.errorMessages[key]) this.errorMessages = this.field.errorMessages[key];
        });
      } else {
        this.errorMessages = '';
      }
    });
  }

  _setLabel(option) {
    if (typeof option === 'object') {
      this.selected = '';
      setTimeout(() => this.selected = new OptionPipe().transform(option, this.selectLabel));
    } else {
      this.selected = option;
    }
  }

  _keyup(value) {
    if (this.field.methods && this.field.methods['keyup']) {
      this.field.methods['keyup'](value);
    } else if (this.field.fieldRestPool) {
      this._setOtherParams();
      this._frp.fieldRestPool(this.field.svc, this.field.fieldRestPool, this.field.fieldRestVal, value, {paramBean: this.params})
        .subscribe((res: any) => this.fieldDataPool = res.list);
    }
  }

  _change() {
    if (this.field.methods && this.field.methods['change']) {
      this.field.methods['change']();
    }
  }

  _focus() {
    if (this.field.methods && this.field.methods['focus']) {
      this.field.methods['focus']();
    } else if (this.field.fieldRestPool) {
      this._setOtherParams();
      this._frp.fieldRestPool(this.field.svc, this.field.fieldRestPool, this.field.fieldRestVal, null, {paramBean: this.params})
        .subscribe((res: any) => this.fieldDataPool = res.list);
    }
  }
}
