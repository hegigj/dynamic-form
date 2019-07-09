import {Component, Input, OnInit} from '@angular/core';
import {FormControlModel} from '../../models/form-control.model';
import {FormGroup} from '@angular/forms';
import {Methods} from '../../models/field-order.model';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit {
  @Input() fieldDataPool: any[];
  @Input() method: Methods;
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormControlModel;
  @Input() fg: FormGroup;

  select = '';

  constructor() { }

  ngOnInit() {
    if (this.field.selectValue) {
      setTimeout(() => {
        this.select = this.field.selectValue;
      }, 300);
    }
  }

  keyup(e) {
    if (this.method && this.method['keyup']) {
      this.method['keyup'](e.srcElement.value);
    }
  }

  change() {
    if (this.method && this.method['change']) {
      this.method['change']();
    }
  }

  focus() {
    if (this.method && this.method['focus']) {
      this.method['focus']();
    }
  }

}
