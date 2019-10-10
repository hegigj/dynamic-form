import {Component, Input, OnInit} from '@angular/core';
import {EmployeeService} from '../app-services/employee.service';
import {FormOrder} from '../../lib/exportable/dynamic-form/models/form-order';
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
  @Input() requestStatus: string;
  @Input() statusArray: any[];

  request: Substitution<string>;
  labels: Substitution<MetadataResponse<Abstract<string>>>;

  // FORM DECLARATION --
  method: string;
  order: FormOrder;
  // -------------------

  constructor(
    private requestService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this._checkRequest();
    this._setMethodAndOrder();
  }

  private _setMethodAndOrder() {

    // FORM ORDER FILL DATA AND SPECIFY METHOD ---------------------------------------------------------------------------
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
      startTimestamp: {
        class: 'col-6',
        disableDatePicker: this.method === 'PUT',
        displayTimePicker: this.method === 'POST',
        disabled: this.method === 'PUT',
        required: true},
      stopTimestamp: {
        class: 'col-6',
        disableDatePicker: this.method === 'PUT',
        displayTimePicker: this.method === 'POST',
        disabled: this.method === 'PUT',
        required: true
      },
      countHD: {class: 'col-12', disabled: this.method === 'PUT', required: true, suffix: {type: 'text', text: 'Hour(s)'}},
      substitutionDates: {
        class: 'col-12',
        disabled: this.method === 'PUT',
        disableDatePicker: this.method === 'PUT',
        displayTimePicker: this.method === 'POST',
        displayDateInputArea: this.method === 'POST',
        dateInputAreaLabel: 'Add new Sub. Date',
        displayRemoveDateInputArea: this.method === 'POST',
        required: true
      },
      employeeNotes: {class: 'col-12', disabled: this.method === 'PUT'}
    };
    // -------------------------------------------------------------------------------------------------------------------

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

  // GET FORM FUNCTION ---------------------------------------------------------------------------
  insertRequest(form) {
    this.router.navigate([], {relativeTo: this.route}).then(() => {
      console.log(form);
    });
  }
  // ---------------------------------------------------------------------------------------------
}
