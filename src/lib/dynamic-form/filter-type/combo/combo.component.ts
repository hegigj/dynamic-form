import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormControlModel} from '../../models/form-control.model';
import {AbstractModel} from '../../models/abstract.model';
import {Methods} from '../../models/field-order.model';
import {SharedService} from '../../controls/shared.service';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.css']
})
export class ComboComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() filter: FormControlModel;
  @Input() fieldDataPool: AbstractModel[];
  @Input() filterChipArray: AbstractModel[];
  @Input() methods: Methods;

  @Output() returnFilterChipArray = new EventEmitter();

  constructor(public _frp: SharedService) { }

  ngOnInit() {
  }

  addSelectFilter(value) {
    this._ifExist(value);
    this.returnFilterChipArray.emit(this.filterChipArray);
  }

  selectFilterValue() {
    const index = this.filterChipArray.findIndex(filter => filter.id === this.filter.fieldName);
    return this.filterChipArray[index] ? this.filterChipArray[index].someLabel : '';
  }

  private _ifExist(value) {
    let changed = false, index = 0;
    this.filterChipArray.forEach((object: AbstractModel, i: number) => {
      if (object.id === this.filter.fieldName) { changed = !(changed); index = i; }
    });
    !changed ?
      this.filterChipArray.push({id: this.filter.fieldName, someLabel: value}) :
      this.filterChipArray[index] = {id: this.filter.fieldName, someLabel: value};
  }

  keyup(e) {
    if (this.methods && this.methods['keyup']) {
      this.methods['keyup'](e);
    } else if (this.filter.fieldRestPool) {
      this._frp.fieldRestPool(this.filter.svc, this.filter.fieldRestPool, this.filter.fieldRestVal, e.srcElement.value).subscribe((res: any) => {
        if (res.status.code === 'STATUS_OK') {
          this.fieldDataPool = res.body.data.list;
        }
      });
    }
  }

  change() {
    if (this.methods && this.methods['change']) {
      this.methods['change']();
    }
  }

  focus() {
    if (this.methods && this.methods['focus']) {
      this.methods['focus']();
    } else if (this.filter.fieldRestPool) {
      this._frp.fieldRestPool(this.filter.svc, this.filter.fieldRestPool, this.filter.fieldRestVal).subscribe((res: any) => {
        if (res.status.code === 'STATUS_OK') {
          this.fieldDataPool = res.body.data.list;
        }
      });
    }
  }
}
