import {Component, Input, OnInit} from '@angular/core';
import {EmployeeService} from '../app-services/employee.service';
import {FormOrder} from '../../lib/exportable/dynamic-form/models/form-order';
import {Abstract} from '../app-models/abstract';
import {MetadataResponse} from '../app-models/metadata-response';
import {Substitution} from '../app-models/substitution';
import {ActivatedRoute, Router} from '@angular/router';
import {TimezonePipe} from '../../lib/common/controls/timezone.pipe';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  requestType: string;
  context: string;
  date: Date;

  @Input() requestId: string;
  @Input() employeeId: string;
  @Input() requestStatus: string;
  @Input() statusArray: any[];

  request: Substitution<string>;
  labels: any;

  // FORM DECLARATION --
  method: string;
  order: FormOrder;
  // -------------------

  constructor(private requestService: EmployeeService) {
    this.date = new Date();
  }

  ngOnInit() {
    this._checkRequest();
    this._setMethodAndOrder();
  }

  private _setMethodAndOrder() {

    // FORM ORDER FILL DATA AND SPECIFY METHOD ---------------------------------------------------------------------------
    this.method = this.requestId ? 'PUT' : 'POST';
    this.order = {
      id: {
        display: this.method === 'PUT',
        disabled: true
      },
      employeeId: {
        class: 'col-12',
        value: this.employeeId,
        selectValue: 'labelMap.employeeId',
        canReset: false
      },
      requestTypeId: {
        class: 'col-12',
        value: 'POOL00000000082',
        selectValue: 'labelMap.requestTypeId',
        canReset: false
      },
      insertDate: {
        value: new TimezonePipe().transform(this.date),
        canReset: false
      },
      startTimestamp: {
        class: 'col-6',
        required: true
      },
      stopTimestamp: {
        class: 'col-6',
        required: true
      },
      countHD: {
        class: 'col-12',
        required: true,
        suffix: {type: 'text', text: 'Hour(s)'}
      },
      substitutionDates: {
        class: 'col-12',
        displayDateInputArea: this.method === 'POST',
        displayRemoveDateInputArea: this.method === 'POST',
        dateInputAreaLabel: 'Add new Sub. Date',
        required: true
      },
      employeeNotes: {
        class: 'col-12',
        onTextInputTextarea: true
      },
      approvementId: {
        class: 'col-6',
        value: 'POOL00000000043',
        display: this.method === 'PUT',
        selectValue: 'labelMap.approvementId'
      },
      managerNotes: {
        class: 'col-6',
        display: this.method === 'PUT'
      },
      authorizationId: {
        class: 'col-6',
        value: 'POOL00000000040',
        display: this.method === 'PUT',
        selectValue: 'labelMap.authorizationId'
      },
      directorNotes: {
        class: 'col-6',
        display: this.method === 'PUT'
      }
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
    console.log(form);
  }
  // ---------------------------------------------------------------------------------------------
}
