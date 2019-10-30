import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {FormOrderConfig} from '../../models/form-order-config';
import {FormControlService} from '../../controls/form-control.service';

@Component({
  selector: 'app-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.css']
})
export class FormArrayComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() fieldArray: FormArray;
  @Input() field: FormOrderConfig;
  @Input() appearance: string;

  formFieldArray: FormOrderConfig[];

  constructor(private _fcs: FormControlService) {
    this.formFieldArray = [];
  }

  ngOnInit() {
    if (Object.keys(this.field.childFieldMeta).length > 0) {
      this.field.childField ? Object.keys(this.field.childField).forEach(key => {
            Object.assign(this.field.childFieldMeta[key], this.field.childField[key]);
            this.formFieldArray.push(this.field.childFieldMeta[key]);
        }) : Object.keys(this.field.childFieldMeta).forEach(key => {
            this.formFieldArray.push(this.field.childFieldMeta[key]);
        });
    }
  }

  add(index) {
    const newFormGroup = this._fcs.create(this.formFieldArray, 'POST');
    index === this.fieldArray.length - 1 ? this.fieldArray.push(newFormGroup) : this.fieldArray.insert(index + 1, newFormGroup);
  }

  delete(index) {
    this.fieldArray.removeAt(index);
  }

  reset(index) {
    this.field.childField ? Object.keys(this.field.childField).forEach(key => {
      if (this.field.childField[key].canReset === undefined || this.field.childField[key].canReset) {
        (<FormGroup>this.fieldArray.at(index)).controls[key].setValue('');
      }
    }) : (<FormGroup>this.fieldArray.at(index)).reset();
  }
}
