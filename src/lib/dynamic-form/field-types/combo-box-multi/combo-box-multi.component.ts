import {Component, Input, OnInit} from '@angular/core';
import {FormControlModel} from '../../models/form-control.model';
import {FormGroup} from '@angular/forms';
import {Methods} from '../../models/field-order.model';

@Component({
  selector: 'app-combo-box-multi',
  templateUrl: './combo-box-multi.component.html',
  styleUrls: ['./combo-box-multi.component.css']
})
export class ComboBoxMultiComponent implements OnInit {
  @Input() fieldDataPool: any[];
  @Input() method: Methods;
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormControlModel;
  @Input() fg: FormGroup;

  selected: any[] = [];
  private _selectedId: string[] = [];

  constructor() { }

  ngOnInit() {
    if (this.field.value) {
      this._selectedId = this.field.value;
      if (this.field.selectValue) {
        let counter = 0;
        this.field.selectValue.forEach((someLabel) => {
          this.selected.push({id: this._selectedId[counter], someLabel: someLabel});
          counter ++;
        });
      }
    }
  }

  addSelection(opt: any) {
    this.selected.push(this.field.selectLabel ? opt[this.field.selectLabel] : opt.someLabel);
    this._selectedId.push(opt.id);
    this.fg.controls[this.field.fieldName].setValue(this._selectedId);
  }

  removeSelection(ind) {
    this.selected.splice(ind, 1);
    this._selectedId.splice(ind, 1);
    this.fg.controls[this.field.fieldName].setValue(this._selectedId);
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
