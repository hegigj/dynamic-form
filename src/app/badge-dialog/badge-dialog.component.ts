import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Badges} from '../app-models/badges';
import {MetadataResponse} from '../app-models/metadata-response';
import {Abstract} from '../app-models/abstract';
import {FormOrder} from '../../lib/exportable/dynamic-form/models/form-order';

export interface DialogData {
  student: string;
  badge: Badges<string>;
  labels: Badges<MetadataResponse<Abstract<string>>>;
  method: string;
  message?: string;
}

@Component({
  selector: 'app-badge-dialog',
  templateUrl: './badge-dialog.component.html',
  styleUrls: ['./badge-dialog.component.css']
})
export class BadgeDialogComponent implements OnInit {
  canPut: boolean;
  order: FormOrder = {
    id: {display: false, canReset: false},
    badgeCode: {class: ['col-6', 'col-sm-12'], canReset: false, suffix: {type: 'text', text: 'RFID'}},
    insertOperator: {class: ['col-6', 'col-sm-12'], selectValue: 'labelMap.insertOperator', suffix: {type: 'icon', text: 'people'}},
    issueDate: {class: 'col-6', dateFormat: 'MMM dd yyyy'},
    lastUpdate: {class: 'col-6', dateFormat: 'MMM dd yyyy'},
    notes: {class: 'col-12', onTextInputTextarea: true},
    badgeStatus: {class: 'col-12', selectValue: 'labelMap.badgeStatus', multi: true, required: true, constraintList: {}}
  };

  constructor(public dlg: MatDialogRef<BadgeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {}

  addBadge(event) {
    if (event.key === 'Enter') {
      this.dlg.close({newBadgeCode: event.srcElement.value});
    }
  }

  editBadge(badge) {
    console.log(badge);
    this.dlg.close(badge);
  }
}
