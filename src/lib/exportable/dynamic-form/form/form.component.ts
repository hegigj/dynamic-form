import {Component, Input, OnInit} from '@angular/core';
import {FormControlService} from '../controls/form-control.service';
import {FormGroup} from '@angular/forms';
import {FieldMapModel} from '../../../common/models/fieldMap.model';
import {FormOrderConfig} from '../models/form-order-config';
import {FormOrder} from '../models/form-order';
import {OptionPipe} from '../../../common/controls/option.pipe';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  // KG OPTIONS SERVICE INPUTS
  @Input() fields: FieldMapModel;
  @Input() fieldDataPool: any;
  @Input() values: any;

  // REQUIRED INPUTS
  @Input() method: string;
  @Input() order: FormOrder;
  @Input() appearance: string;
  @Input() hideSkeleton: boolean;

  form: FormGroup;
  setSkeleton: any[];
  fieldArray: FormOrderConfig[];

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

  private _setMetaExtra() {
    if (this.order) {
      Object.keys(this.order).forEach((key) => {
        this._setMetaSelectedValue(key);
        Object.assign(this.fields[key], this.order[key]);
      });
    }
  }

  private _setMetaSelectedValue(key?) {
    if (this.values) {
      if (this.order && this.order[key]) {
        if (this.order[key].selectValue) {
          this.order[key].selectValue = new OptionPipe().transform(this.values, this.order[key].selectValue);
        } else {
          delete this.order[key].selectValue;
        }
      }
    }
  }

  private _setValue() {
    if (this.values) {
      Object.keys(this.fields)
        .forEach(key => Object.assign(this.fields[key], {value: this.values[key]}));
    }
  }

  private _setSkeleton() {
    Object.keys(this.order ? this.order : this.fields)
      .forEach(key => this.setSkeleton.push(this.order ? this.order[key] : this.fields[key]));
  }

  private _getFields() {
    Object.keys(this.order ? this.order : this.fields)
      .forEach(field => this.fieldArray.push(this.fields[field]));
  }

  private _fgCreator() {
    setTimeout(() => {
      this.form = this._fcs.create(this.fieldArray, this.method);
      this._returnFormValidity();
    }, 1360);
  }

  private _returnFormValidity() {
    if (this.form) {
      this._fcs.setForm$(this.form, this.order, this.form.status);
      this.form.statusChanges.subscribe(validity => this._fcs.setForm$(this.form, this.order, validity));
    }
  }
}
