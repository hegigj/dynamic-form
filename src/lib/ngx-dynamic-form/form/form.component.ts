import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControlService} from '../controls/form-control.service';
import {FormControlModel, ObjectType} from '../models/form-control.model';
import {FormGroup} from '@angular/forms';
import {FieldMapModel} from '../models/fieldMap.model';
import {FieldOrderModel} from '../models/field-order.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, OnChanges {
  // KG OPTIONS SERVICE INPUTS
  @Input() fields: FieldMapModel;
  @Input() values: any;
  @Input() fieldDataPool: any;

  // REQUIRED INPUTS
  @Input() method: string;
  @Input() appearance: string;
  @Input() order: FieldOrderModel;

  // GET AND RESET FORM TOGGLE INPUTS
  @Input() returnForm: boolean;
  @Input() resetForm: boolean;

  // RETURN FORM AND FORM VALIDITY OUTPUTS
  @Output() getValidity = new EventEmitter<boolean>();
  @Output() getFormData = new EventEmitter<any>();

  form: FormGroup;
  setSkeleton: any[] = [];
  fieldArray: FormControlModel[] = [];

  constructor(private _fcs: FormControlService) {}

  ngOnInit() {
    if (this.fields) {
      this._setValue();
      this._setMetaValue();
      this._setMetaSelectedValue();
      this._setMetaExtra();
      this._setSkeleton();

      this._getFields();

      this._fgCreator();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.returnForm && changes.returnForm.currentValue) {
      this._returnForm();
    }
    if (changes.resetForm && changes.resetForm.currentValue) {
      this._resetForm();
    }
  }

  private _setValue() {
    if (this.values) {
      Object.keys(this.fields).forEach((key) => {
        Object.assign(this.fields[key], {value: this.values[key]});
      });
    }
  }

  private _setMetaValue() {
    if (this.order) {
      Object.keys(this.order).forEach((key) => {
        if (this.order[key].value) {
          Object.assign(this.fields[key], {value: this.order[key].value});
        }
      });
    }
  }

  private _setMetaSelectedValue() {
    if (this.values && this.order) {
      Object.keys(this.order).forEach((key) => {
        if (this.order[key].selectValue) {
          const selectValue = this.order[key].selectValue;
          this.fields[key].selectValue = selectValue.match(/[a-zA-Z_]+\s[a-zA-Z_]+/g) ?
            `${this.values[selectValue.split(' ')[0]]} ${this.values[selectValue.split(' ')[1]]}` : selectValue.match(/\./g) ?
            this.values[selectValue.split('.')[0]][selectValue.split('.')[1]] : this.values[selectValue];
        }
      });
    }
  }

  private _setMetaExtra() {
    if (this.order) {
      Object.keys(this.order).forEach((key) => {
        if (this.order[key].display !== undefined) {
          Object.assign(this.fields[key], {display: this.order[key].display});
        }
        if (this.order[key].disabled) {
          Object.assign(this.fields[key], {disabled: this.order[key].disabled});
        }
        if (this.order[key].disableDatePicker) {
          Object.assign(this.fields[key], {disableDatePicker: this.order[key].disableDatePicker});
        }
        if (this.order[key].disableTimePicker) {
          Object.assign(this.fields[key], {disableTimePicker: this.order[key].disableTimePicker});
        }
        if (this.order[key].disableDateInputArea) {
          Object.assign(this.fields[key], {disableDateInputArea: this.order[key].disableDateInputArea});
        }
        if (this.order[key].disableRemoveDateInputArea) {
          Object.assign(this.fields[key], {disableRemoveDateInputArea: this.order[key].disableRemoveDateInputArea});
        }
        if (this.order[key].multi) {
          Object.assign(this.fields[key], {multi: this.order[key].multi});
        }
        if (this.order[key].required) {
          Object.assign(this.fields[key], {required: this.order[key].required});
        }
      });
    }
  }

  private _setSkeleton() {
    Object.keys(this.order ? this.order : this.fields).forEach((key) => {
      this.setSkeleton.push(this.order ? this.order[key] : this.fields[key]);
    });
  }

  private _getFields() {
    this.order ?
      Object.keys(this.order).forEach((order) => {

        Object.keys(this.fields).forEach((key) => { if (key === order) { this.fieldArray.push(this.fields[key]); }});

      }) : Object.keys(this.fields).forEach((key) => this.fieldArray.push(this.fields[key]));
  }

  private _fgCreator() {
    setTimeout(() => {
      this.form = this._fcs.create(this.fieldArray, this.method);
      if (this.form.status === 'VALID') {
        this.getValidity.emit(true);
      } this._returnFormValidity();
    }, 1360);
  }

  private _objectifyForm(controls) {
    const object: ObjectType = {};
    Object.keys(controls).forEach((key) => {
      Object.assign(object, {[key]: controls[key].value});
    }); return object;
  }

  private _returnFormValidity() {
    if (this.form) {
      this.form.statusChanges.subscribe((res: any) => {
        this.getValidity.emit(res === 'VALID');
      });
    }
  }

  private _resetForm() {
    if (this.form) {
      if (this.order) {
        Object.keys(this.order).forEach((key) => {
          if (this.order[key].canReset === undefined || this.order[key].canReset) {
            this.form.controls[key].setValue('');
          }
        });
      } else {
        this.form.reset();
      }
    }
  }

  private _returnForm() {
    if (this.form) {
      const form: ObjectType = this._objectifyForm(this.form.controls);
      this.getFormData.emit(form);
    }
  }
}
