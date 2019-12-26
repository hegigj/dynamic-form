import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormOrderConfig} from '../models/form-order-config';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Input() appearance: string;
  @Input() fg: FormGroup;
  @Input() field: FormOrderConfig;
  @Input() fieldDataPool: any[];

  display: boolean;

  constructor() {}

  ngOnInit() {
    this.display = this.field.display !== undefined ? this.field.display : true;
  }
}
