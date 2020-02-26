import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControlService} from '../controls/form-control.service';
import {FormGroup} from '@angular/forms';
import {FieldMapModel} from '../../../common/models/fieldMap.model';
import {FormOrderConfig} from '../models/form-order-config';
import {FormOrder} from '../models/form-order';
import {OptionPipe} from '../../../common/controls/option.pipe';
import {BootstrapClass} from '../../../common/models/extra.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, OnDestroy {
  // KG OPTIONS SERVICE INPUTS
  @Input() fields: FieldMapModel;
  @Input() fieldDataPool: any;
  @Input() values: any;

  // REQUIRED INPUTS
  @Input() method: string; // POST or PUT
  @Input() order: FormOrder;
  @Input() appearance: string; // 'outline'
  @Input() hideSkeleton: boolean;

  form: FormGroup;
  setSkeleton: BootstrapClass[] | any;
  fieldArray: FormOrderConfig[];

  private _checkSubscribtion: Subscription;

  constructor(private _fcs: FormControlService) {
    this.hideSkeleton = false;
    this.setSkeleton = [];
    this.fieldArray = [];
  }

  ngOnInit() {
    if (this.fields) {
      this._setMetaExtra();
      this._setValue();
      this._setSkeleton();

      this._getFields();
      this._fgCreator();
    }
  }

  ngOnDestroy() {
    this._checkSubscribtion.unsubscribe();
  }

  private _setMetaExtra(): void {
    if (this.order) {
      Object.keys(this.order).forEach(key => {
        this._setMetaSelectedValue(key);
        Object.assign(this.fields[key], this.order[key]);
      });
    }
  }

  private _setMetaSelectedValue(key: string): void {
    if (this.values) {
      if (this.order[key].selectValue) {
        this.order[key].selectValue = new OptionPipe().transform(this.values, this.order[key].selectValue);
      } else {
        delete this.order[key].selectValue;
      }
    }
  }

  private _setValue(): void {
    if (this.values) {
      Object.keys(this.fields)
        .forEach(key => Object.assign(this.fields[key], {value: this.values[key]}));
    }
  }

  private _setSkeleton(): void {
    Object.keys(this.order ? this.order : this.fields)
      .forEach(key => this.setSkeleton.push((this.order && this.order[key] && this.order[key].class) ? this.order[key].class : 'col-12'));
  }

  private _getFields(): void {
    Object.keys(this.order ? this.order : this.fields)
      .forEach(field => this.fieldArray.push(this.fields[field]));
  }

  private _fgCreator(): void {
    setTimeout(() => {
      this.form = this._fcs.create(this.fieldArray, this.method);
      this._returnFormValidity();
    }, 1360);
  }

  private _returnFormValidity(): void {
    if (this.form) {
      this._fcs.setForm$(this.form, this.order, this.form.status);
      this._checkSubscribtion = this.form.statusChanges.subscribe(validity => this._fcs.setForm$(this.form, this.order, validity));
    }
  }
}
