import {Component, Input, OnInit} from '@angular/core';
import {FormControlModel} from '../models/form-control.model';
import {FormGroup} from '@angular/forms';
import {Methods} from '../models/field-order.model';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Input() field: FormControlModel;
  @Input() fg: FormGroup;
  @Input() fieldDataPool: any[];
  @Input() method: Methods;
  @Input() appearance: string;

  display: boolean;
  notId: boolean;

  constructor() {}

  ngOnInit() {
    this.display = this.field.display !== undefined ? this.field.display : true;
    this.notId = this.field.fieldName !== 'id';
  }
}