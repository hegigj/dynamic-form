import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControlService} from '../controls/form-control.service';
import {FormGroup} from '@angular/forms';
import {FieldMapModel} from '../../../common/models/fieldMap.model';
import {FormOrderConfig} from '../models/form-order-config';
import {FormOrder} from '../models/form-order';
import {OptionPipe} from '../../../common/controls/option.pipe';
import {BootstrapClass} from '../../../common/models/extra.model';
import {Subscription} from 'rxjs';
import {AbstractModel} from '../../../common/models/abstract.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, OnDestroy {
  // KG OPTIONS SERVICE INPUTS
  @Input()
  set fields(value: FieldMapModel) {
    this._fields = value;
    this._setUpForm();
  }

  // OPTIONAL INPUTS
  @Input() values: any;
  @Input() fieldDataPool: AbstractModel[] | any;
  @Input() appearance: string; // 'outline'
  @Input() hideSkeleton: boolean; // false

  // REQUIRED INPUTS
  @Input() method: string; // POST or PUT
  @Input() order: FormOrder; // {firstName: {class: 'col-6'}, lastName: {class: 'col-6'},...}

  form: FormGroup;
  fieldArray: FormOrderConfig[];
  skeleton: Array<BootstrapClass | BootstrapClass[]>;

  private _fields: FieldMapModel;
  private _checkSubscription: Subscription;

  constructor(private _fcs: FormControlService) {
    this.hideSkeleton = false;
  }

  ngOnInit() {
    !this.hideSkeleton ? this._setSkeleton() : NaN;
  }

  ngOnDestroy() {
    this._checkSubscription.unsubscribe();
  }

  private _setUpForm(): void {
    this._setMetaExtra();
    this._setValue();
    this._setFields();

    this._fgCreator();
  }

  private _setSkeleton(): void {
    this.skeleton = [];
    Object.keys(this.order ? this.order : this._fields ? this._fields : {})
      .forEach(key => this.skeleton.push((this.order && this.order[key] && this.order[key].class) ? this.order[key].class : 'col-12'));
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
      Object.keys(this._fields)
        .forEach(key => Object.assign(this._fields[key], {value: this.values[key]}));
    }
  }

  private _setFields(): void {
    this.fieldArray = [];
    Object.keys(this.order ? this.order : this._fields)
      .forEach(field => this.fieldArray.push(this._fields[field]));
  }

  private _fgCreator(): void {
    setTimeout(() => {
      this.form = this._fcs.create(this.fieldArray, this.method);
      this._returnFormValidity();
    }, 300);
  }

  private _returnFormValidity(): void {
    if (this.form) {
      this._fcs.setForm$(this.form, this.order, this.form.status);

      this._checkSubscription = this.form
        .statusChanges
        .subscribe(validity => this._fcs.setForm$(this.form, this.order, validity));
    }
  }
}
