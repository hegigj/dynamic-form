import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormOrderConfig} from '../models/form-order-config';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Input() field: FormOrderConfig;
  @Input() fg: FormGroup;
  @Input() fieldDataPool: any[];
  @Input() appearance: string;

  display: boolean;
  notId: boolean;

  constructor() {}

  ngOnInit() {
    this.display = this.field.display !== undefined ? this.field.display : true;
    this.notId = this.field.fieldName !== 'id';
  }
}
