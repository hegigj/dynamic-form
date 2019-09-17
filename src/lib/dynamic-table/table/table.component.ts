import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Buttons} from '../../models/field-order.model';
import {FieldMapModel} from '../../models/fieldMap.model';
import {FormControlModel} from '../../models/form-control.model';
import {ParamBeanModel} from '../../models/param-bean.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() labels: FieldMapModel;
  @Input() values: any[];
  @Input() order;
  @Input() buttons: {[button: string]: Buttons};
  @Input() pageSizeArray: number[];
  @Input() totalRecords: number;
  @Input() params: ParamBeanModel;

  @Output() paramsEmitter = new EventEmitter<{pageNo: number, pageSize: number}>();

  labelsArray: FormControlModel[];
  loading: boolean;

  constructor() {
    this.labelsArray = [];
    this.loading = false;
  }

  ngOnInit() {
    if (this.order) {
      this._setExtra();
      this._getTableRows();
      setTimeout(() => this.loading = !(this.loading), 1500);
    }
  }

  private _getTableRows() {
    if (this.order) {
      Object.keys(this.order).forEach((order) => {
        Object.keys(this.labels).forEach((key) => {
          if (key === order) {
            this.labelsArray.push(this.labels[key]);
          }
        });
      });
    }
  }

  private _setExtra() {
    if (this.order) {
      Object.keys(this.order).forEach((key) => {
        if (this.order[key].xClass) {
          Object.assign(this.labels[key], {xClass: this.order[key].xClass});
        }
        if (this.order[key].selectValue) {
          Object.assign(this.labels[key], {selectValue: this.order[key].selectValue});
        }
        if (this.order[key].selectLabel) {
          Object.assign(this.labels[key], {selectLabel: this.order[key].selectLabel});
        }
        if (this.order[key].label) {
          Object.assign(this.labels[key], {label: this.order[key].label});
        }
        if (this.order[key].labelClass) {
          Object.assign(this.labels[key], {labelClass: this.order[key].labelClass});
        }
        if (this.order[key].labelSeparator) {
          Object.assign(this.labels[key], {labelSeparator: this.order[key].labelSeparator});
        }
        if (this.order[key].isDate) {
          Object.assign(this.labels[key], {isDate: this.order[key].isDate});
        }
        if (this.order[key].dateFormat) {
          Object.assign(this.labels[key], {dateFormat: this.order[key].dateFormat});
        }
        if (this.order[key].verticalLabels) {
          Object.assign(this.labels[key], {verticalLabels: this.order[key].verticalLabels});
        }
        if (this.order[key].horizontalLabels) {
          Object.assign(this.labels[key], {horizontalLabels: this.order[key].horizontalLabels});
        }
        if (this.order[key].primaryLabels) {
          Object.assign(this.labels[key], {primaryLabels: this.order[key].primaryLabels});
        }
        if (this.order[key].secondaryLabels) {
          Object.assign(this.labels[key], {secondaryLabels: this.order[key].secondaryLabels});
        }
        if (this.order[key].avatar) {
          Object.assign(this.labels[key], {avatar: this.order[key].avatar});
        }
        if (this.order[key].fgColor) {
          Object.assign(this.labels[key], {fgColor: this.order[key].fgColor});
        }
        if (this.order[key].bgColor) {
          Object.assign(this.labels[key], {bgColor: this.order[key].bgColor});
        }
        if (this.order[key].avatarName) {
          Object.assign(this.labels[key], {avatarName: this.order[key].avatarName});
        }
        if (this.order[key].avatarSrc) {
          Object.assign(this.labels[key], {avatarSrc: this.order[key].avatarSrc});
        }
        if (this.order[key].avatarSize) {
          Object.assign(this.labels[key], {avatarSize: this.order[key].avatarSize});
        }
        if (this.order[key].replaceNullValue) {
          Object.assign(this.labels[key], {replaceNullValue: this.order[key].replaceNullValue});
        }
      });
    }
  }

  switchPage(event) {
    this.params.paramBean.pageNo = event.pageIndex + 1;
    this.params.paramBean.pageSize = event.pageSize;
    this.paramsEmitter.emit({pageNo: this.params.paramBean.pageNo, pageSize: this.params.paramBean.pageSize});
  }
}
