import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControlService} from '../controls/form-control.service';
import {FormControlModel} from '../models/form-control.model';
import {FormGroup} from '@angular/forms';
import {FieldMapModel} from '../models/fieldMap.model';
import {FieldOrderModel} from '../models/field-order.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() labels: FieldMapModel;
  @Input() labelsValue: any;
  @Input() fieldDataPool: any;

  @Input() method: string;
  @Input() order: FieldOrderModel;
  @Input() appearance: string;

  @Input() submit: boolean;
  @Output() isValid = new EventEmitter<boolean>();
  @Output() formEmitter = new EventEmitter<any>();

  form: FormGroup;
  fields: FormControlModel[] = [];
  setSkeleton: any[] = [];

  constructor(private _fcs: FormControlService) {}

  ngOnInit() {
    if (this.labels) {
      this._setValue();
      this._setMetaValue();
      this._setMetaSelectedValue();
      this._setMetaExtra();
      this._setSkeleton();

      this._getFields();

      setTimeout(() => {
        this.form = this._fcs.create(this.fields, this.method);
        this._returnFormValidity();
      }, 1300);
    }
  }

  ngOnChanges(sch: SimpleChanges) {
    if (sch.submit && sch.submit.currentValue) {
      if (sch.submit.currentValue) {
        this._returnForm();
      }
    }
  }

  ngOnDestroy() {
    this.formEmitter.unsubscribe();
    this.isValid.unsubscribe();
    this.form.reset();
  }

  private _setValue() {
    if (this.labelsValue) {
      Object.keys(this.labels).forEach((key) => {
        Object.assign(this.labels[key], {value: this.labelsValue[key]});
      });
    }
  }

  private _setMetaValue() {
    if (this.order) {
      Object.keys(this.order).forEach((key) => {
        if (this.order[key].value) {
          Object.assign(this.labels[key], {value: this.order[key].value});
        }
      });
    }
  }

  private _setMetaSelectedValue() {
    if (this.labelsValue) {
      Object.keys(this.order).forEach((key) => {
        if (this.order[key].selectValue) {
          const selectValue = this.order[key].selectValue;
          this.labels[key].selectValue = selectValue.match(/[a-zA-Z_]+\s[a-zA-Z_]+/g) ?
            `${this.labelsValue[selectValue.split(' ')[0]]} ${this.labelsValue[selectValue.split(' ')[1]]}` : selectValue.match(/\./g) ?
            this.labelsValue[selectValue.split('.')[0]][selectValue.split('.')[1]] : this.labelsValue[selectValue];
        }
      });
    }
  }

  private _setMetaExtra() {
    Object.keys(this.order).forEach((key) => {
      if (this.order[key].display !== undefined) {
        Object.assign(this.labels[key], {display: this.order[key].display});
      }
      if (this.order[key].disabled) {
        Object.assign(this.labels[key], {disabled: this.order[key].disabled});
      }
      if (this.order[key].disableDatePicker) {
        Object.assign(this.labels[key], {disableDatePicker: this.order[key].disableDatePicker});
      }
      if (this.order[key].disableTimePicker) {
        Object.assign(this.labels[key], {disableTimePicker: this.order[key].disableTimePicker});
      }
      if (this.order[key].disableDateInputArea) {
        Object.assign(this.labels[key], {disableDateInputArea: this.order[key].disableDateInputArea});
      }
      if (this.order[key].disableRemoveDateInputArea) {
        Object.assign(this.labels[key], {disableRemoveDateInputArea: this.order[key].disableRemoveDateInputArea});
      }
      if (this.order[key].multi) {
        Object.assign(this.labels[key], {multi: this.order[key].multi});
      }
      if (this.order[key].required) {
        Object.assign(this.labels[key], {required: this.order[key].required});
      }
    });
  }

  private _setSkeleton() {
    Object.keys(this.order ? this.order : this.labels).forEach((key) => {
      this.setSkeleton.push(this.order ? this.order[key] : this.labels[key]);
    });
  }

  private _getFields() {
    this.order ?
      Object.keys(this.order).forEach((order) => {

        Object.keys(this.labels).forEach((key) => { if (key === order) { this.fields.push(this.labels[key]); }});

      }) : Object.keys(this.labels).forEach((key) => this.fields.push(this.labels[key]));
  }

  private _objectifyForm(controls) {
    const object: any = {};
    Object.keys(controls).forEach((key) => {
      Object.assign(object, {[key]: controls[key].value});
    }); return object;
  }

  private _returnFormValidity() {
    if (this.form.status === 'VALID') {
      this.isValid.emit(true);
    }
    this.form.statusChanges.subscribe((res: any) => {
      this.isValid.emit(res === 'VALID');
    });
  }

  private _returnForm() {
    this.formEmitter.emit(this._objectifyForm(this.form.controls));
    setTimeout(() => {
      if (this.method && this.method === 'POST') {
        this.form.reset();
      } this.isValid.emit(false);
    }, 600);
  }
}
