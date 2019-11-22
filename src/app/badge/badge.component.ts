import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Students} from '../app-models/students';
import {MetadataResponse} from '../app-models/metadata-response';
import {Abstract} from '../app-models/abstract';
import {FormOrder} from '../../lib/exportable/dynamic-form/models/form-order';
import {Badges} from '../app-models/badges';
import {ListResponse} from '../app-models/list-response';
import {ParamBean} from '../app-models/param-bean';
import {EmployeeService} from '../app-services/employee.service';
import {BadgeDialogComponent} from '../badge-dialog/badge-dialog.component';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent implements OnInit {
  @Input() studentId: string;
  @Input() labels: Students<MetadataResponse<Abstract<string>>, MetadataResponse<Abstract<string>>>;

  student: Students<string, number>;
  moreInfo: FormOrder = {
    registrationDate: {class: 'col-6', disabled: true, displayDatePicker: false, displayTimePicker: false},
    firstAccYear: {class: 'col-6', disabled: true},
    studentLegalUsn: {class: 'col-6', disabled: true},
    studentUsn: {class: 'col-6', disabled: true},
    birthDate: {class: 'col-6', disabled: true, displayDatePicker: false, displayTimePicker: false},
    studStatus: {class: 'col-6', disabled: true}
  };

  badgeLabels: Badges<MetadataResponse<Abstract<string>>>;
  badges: ListResponse<Badges<string>>;
  tableData = {
    totalPages: 3,
    totalRecords: 12
  };

  params: ParamBean = {
    paramBean: {
      fillFieldLabels: true,
      pageSize: 4,
      pageNo: 1
    }
  };

  constructor(private studentService: EmployeeService,
              private badgeService: EmployeeService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.initControl();
  }

  initControl() {
    this.getBadgeLabels();
    this.getBadgesList();
    this.getStudent();
  }

  getBadgeLabels() {
    this.badgeService.getBadgesMeta(this.studentId).subscribe((response: any) => {
      this.badgeLabels = response.body.data.fieldMap;
    });
  }

  getStudent() {
    this.studentService.getStudent(this.studentId).subscribe((res: any) => {
      this.student = res;
    });
  }

  getBadgesList() {
    this.badgeService.getBadgesList(this.studentId, {params: this.params}).subscribe((response: any) => {
      this.badges = response.body.data;
      this.tableData.totalPages = response.body.data.totalPages;
      this.tableData.totalRecords = response.body.data.totalRecords;
    });
  }

  refreshList(event) {
    this.params.paramBean.pageNo = event.pageIndex + 1;
    this.params.paramBean.pageSize = event.pageSize;
    this.getBadgesList();
  }

  editBadge(badge, message?) {
    const editBadge = this.dialog.open(BadgeDialogComponent, {
      width: '600px',
      data: {
        student: `${this.student.firstName} ${this.student.lastName}`,
        badge: badge,
        labels: this.badgeLabels,
        method: 'PUT',
        message: message
      }
    });
    editBadge.afterClosed().subscribe((result: any) => {
      if (result) {
        this.badgeService.editBadge(this.studentId, badge.id, result).subscribe((response: any) => {
          if (response.status.code === 'STATUS_OK') {
            this.getBadgesList();
          }
        });
      }
    });
  }

  addBadge() {
    const addBadge = this.dialog.open(BadgeDialogComponent, {
      width: '600px',
      data: {badge: undefined, labels: undefined, method: 'POST'}
    });
    addBadge.afterClosed().subscribe((result: any) => {
      if (result) {
        const object = {
          studentRegistrationId: this.studentId,
          badgeCode: result.newBadgeCode
        };
        this.badgeService.addBadge(this.studentId, object).subscribe((response: any) => {
          if (response.status.code === 'STATUS_OK') {
            this.getBadgesList();
          } else if (response.status.code === 'EXPECTATION_FAILED') {
            this.editBadge(response.body.data, response.status.message);
          }
        });
      }
    });
  }

  downloadBadge(id) {
    this.badgeService.downloadBadge(this.studentId, id).subscribe((blob: Blob) => {
      const data = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = data;
      link.download = `badge_(${id}).pdf`;
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
      }, 100);
    });
  }

}
