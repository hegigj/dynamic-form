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
    id: {display: false},
    badgeCode: {class: 'col-6'},
    issueDate: {class: 'col-6', displayTimePicker: false},
    insertOperator: {class: 'col-6', selectValue: 'labelMap.insertOperator'},
    notes: {class: 'col-6'},
    lastUpdate: {class: 'col-6', disabled: true, displayTimePicker: false},
    badgeStatus: {class: 'col-6', selectValue: 'labelMap.badgeStatus'}
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
    this.dlg.close(badge);
  }
}
