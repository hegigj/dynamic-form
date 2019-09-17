import {Component, Input, OnInit} from '@angular/core';
import {EmployeeService} from '../app-services/employee.service';
import {FormOrder} from '../../lib/dynamic-form/models/form-order';
import {SidebarService} from '../../lib/sidebar/controls/sidebar.service';
import {Abstract} from '../app-models/abstract';
import {MetadataResponse} from '../app-models/metadata-response';
import {Substitution} from '../app-models/substitution';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  requestType: string;
  context: string;

  @Input() requestId: string;
  @Input() employeeId: string;
  @Input() requestStatus: Abstract<string>;

  request: Substitution<string>;
  labels: Substitution<MetadataResponse<Abstract<string>>>;

  method: string;
  order: FormOrder;
  valid: boolean;

  constructor(
    private sidebarService: SidebarService,
    private requestService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this._checkRequest();
    this._setMethodAndOrder();
  }

  private _setMethodAndOrder() {
    this.method = this.requestId ? 'PUT' : 'POST';
    this.order = {
      id: {disabled: true},
      employeeId: {
        class: 'col-12',
        value: this.employeeId,
        selectValue: 'labelMap.employeeId',
        display: this.method === 'PUT',
        canReset: false
      },
      requestTypeId: {display: false, value: 'POOL00000000082', selectValue: 'labelMap.requestTypeId', canReset: false},
      insertDate: {
        display: false,
        value: new Date(new Date().valueOf() + 8.64e+7).toISOString().split('.')[0],
        canReset: false
      },
      startTimestamp: {class: 'col-6', disabled: this.method === 'PUT'},
      stopTimestamp: {class: 'col-6', disabled: this.method === 'PUT'},
      countHD: {class: 'col-12', disabled: this.method === 'PUT'},
      substitutionDates: {
        class: 'col-12',
        disabled: this.method === 'PUT',
        disableDatePicker: this.method === 'PUT',
        displayTimePicker: this.method === 'POST',
        displayDateInputArea: this.method === 'POST',
        dateInputAreaLabel: 'Add new Sub. Date',
        displayRemoveDateInputArea: this.method === 'POST'
      },
      employeeNotes: {class: 'col-12', disabled: this.method === 'PUT'}
    };
  }

  private _checkRequest() {
    if (this.requestId) {
      this.context = 'UPDATE';
      this._getRequest();
    } else {
      this.context = 'NEW';
      this._getLabels();
    }
  }

  private _getLabels() {
    this.requestService.getSubstitutionMeta().subscribe((fields: any) => {
      this.requestType = fields.body.data.label;
      this.labels = fields.body.data.fieldMap;
    });
  }

  private _getRequest() {
    this.requestService.getSubstitution(this.requestId, {params: {paramBean: {fillFieldLabels: true}}}).subscribe((request: any) => {
      if (request.status.code === 'STATUS_OK') {
        this.request = request.body.data;
        this._getLabels();
      }
    });
  }

  insertRequest(form) {
    this.router.navigate([], {relativeTo: this.route}).then(() => {
      this.sidebarService.setComponent(false);
      console.log(form);
    });
  }
}
