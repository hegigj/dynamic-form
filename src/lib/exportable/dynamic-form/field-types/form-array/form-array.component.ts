import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {FormOrderConfig} from '../../models/form-order-config';

@Component({
  selector: 'app-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.css']
})
export class FormArrayComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() field: FormOrderConfig;
  @Input() fieldArray: FormArray;

  formFieldArray: FormOrderConfig[];

  constructor() {
    this.formFieldArray = [];
  }

  ngOnInit() {
    Object.keys(this.field.childFieldMeta).forEach(key => this.formFieldArray.push(this.field.childFieldMeta[key]));
  }

}
