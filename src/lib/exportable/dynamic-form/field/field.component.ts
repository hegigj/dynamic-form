import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormOrderConfig} from '../models/form-order-config';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  private _field: FormOrderConfig;
  display: boolean;

  @Input() fg: FormGroup;
  @Input()
  set field(value: FormOrderConfig) {
    this._field = value;
    this.display = this._field.display !== undefined ? this._field.display : true;
  }

  get field(): FormOrderConfig {
    return this._field;
  }

  @Input() appearance: string;
  @Input() fieldDataPool: any[];

  constructor() {}

  ngOnInit() {}
}
