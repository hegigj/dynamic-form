import {Component, Input, OnInit} from '@angular/core';
import {FormControlModel} from '../../models/form-control.model';
import {Buttons} from '../../models/field-order.model';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  @Input() labels: FormControlModel[];
  @Input() values: any[];
  @Input() buttons: {[button: string]: Buttons};

  buttonGroup: Buttons[] = [];

  constructor() {}

  ngOnInit() {
    if (this.buttons) {
      Object.keys(this.buttons).forEach((key) => this.buttonGroup.push(this.buttons[key]));
    }
  }

  _extractMetaLabels(value, label, ref) {
    if (label[ref].match(/([a-zA-Z]+\s)+[a-zA-z]+/g)) {
      let val = '';
      const _label = label[ref].split(' ');
      const separator = label.labelSeparator ? label.labelSeparator : ' ';
      for (let i = 0; i < _label.length; i++) {
        if (value[_label[i]]) {
          val += `${value[_label[i]]}${separator}`;
        } else {
          val += `${label.replaceNullValue}${separator}`;
        }
      }
      return val.substr(0, val.length - separator.length);
    } else if (label[ref].match(/\./g)) {
      return value[label[ref].split('.')[0]][label[ref].split('.')[1]];
    } else {
      return value[label[ref]];
    }
  }

  _button(button, event) {
    console.log(event);
    if (this.buttons && this.buttons[button].method) {
      this.buttons[button]['method'](event);
    }
  }
}
