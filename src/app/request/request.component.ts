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

  constructor(
    private requestService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.date = new Date();
    // this.labels = {
    //   updateDate: {
    //     'fieldName': 'updateDate',
    //     'fieldLabel': 'Update Date',
    //     'inputType': 'DATE_INPUT',
    //     'canGet': true,
    //     'canPost': false,
    //     'canPut': false,
    //     'constraintList': {},
    //     'childFieldMeta': {}
    //   },
    //   insertDate: {
    //     'fieldName': 'insertDate',
    //     'fieldLabel': 'Insert Date',
    //     'inputType': 'DATE_INPUT',
    //     'canGet': true,
    //     'canPost': true,
    //     'canPut': false,
    //     'constraintList': {},
    //     'childFieldMeta': {}
    //   },
    //   name: {
    //     'fieldName': 'name',
    //     'fieldLabel': 'Title',
    //     'inputType': 'TEXT_INPUT',
    //     'canGet': true,
    //     'canPost': true,
    //     'canPut': false,
    //     'constraintList': {
    //       'Size': {
    //         'type': 'Size',
    //         'message': 'The size of this string is not valid',
    //         'min': 15,
    //         'max': 500
    //       },
    //       'NotNull': {
    //         'type': 'NotNull',
    //         'message': 'The value must not be null'
    //       }
    //     },
    //     'childFieldMeta': {}
    //   },
    //   description: {
    //     'fieldName': 'description',
    //     'fieldLabel': 'Description',
    //     'inputType': 'TEXT_INPUT',
    //     'canGet': true,
    //     'canPost': true,
    //     'canPut': false,
    //     'constraintList': {
    //       'Size': {
    //         'type': 'Size',
    //         'message': 'The size of this string is not valid',
    //         'min': 45,
    //         'max': 1024
    //       }
    //     },
    //     'childFieldMeta': {}
    //   },
    //   insertOperator: {
    //     'fieldName': 'insertOperator',
    //     'fieldLabel': 'Insert Operator',
    //     'inputType': 'TEXT_INPUT',
    //     'canGet': true,
    //     'canPost': true,
    //     'canPut': false,
    //     'constraintList': {
    //       'Size': {
    //         'type': 'Size',
    //         'message': 'The size of this string is not valid',
    //         'min': 0,
    //         'max': 15
    //       }
    //     },
    //     'childFieldMeta': {}
    //   },
    //   updateOperator: {
    //     'fieldName': 'updateOperator',
    //     'fieldLabel': 'Update Operator',
    //     'inputType': 'TEXT_INPUT',
    //     'canGet': true,
    //     'canPost': false,
    //     'canPut': false,
    //     'constraintList': {
    //       'Size': {
    //         'type': 'Size',
    //         'message': 'The size of this string is not valid',
    //         'min': 0,
    //         'max': 15
    //       }
    //     },
    //     'childFieldMeta': {}
    //   },
    //   questionList: {
    //     'fieldName': 'questionList',
    //     'fieldLabel': 'com.teamdae.unisat.model.survey.Survey.questionList.label',
    //     'inputType': 'INPUT_TABLE',
    //     'canGet': true,
    //     'canPost': true,
    //     'canPut': true,
    //     'constraintList': {},
    //     'childFieldMeta': {
    //       'questionTitle': {
    //         'value': 'Question 1',
    //         'fieldName': 'questionTitle',
    //         'fieldLabel': 'Question Title',
    //         'inputType': 'TEXT_INPUT',
    //         'canGet': true,
    //         'canPost': true,
    //         'canPut': false,
    //         'constraintList': {
    //           'Size': {
    //             'type': 'Size',
    //             'message': 'The size of this string is not valid',
    //             'min': 10,
    //             'max': 500
    //           },
    //           'NotNull': {
    //             'type': 'NotNull',
    //             'message': 'The value must not be null'
    //           }
    //         },
    //         'childFieldMeta': {}
    //       },
    //       'questionDescription': {
    //         'fieldName': 'questionDescription',
    //         'fieldLabel': 'Description',
    //         'inputType': 'TEXT_INPUT',
    //         'canGet': true,
    //         'canPost': true,
    //         'canPut': false,
    //         'constraintList': {
    //           'Size': {
    //             'type': 'Size',
    //             'message': 'The size of this string is not valid',
    //             'min': 25,
    //             'max': 500
    //           },
    //           'NotNull': {
    //             'type': 'NotNull',
    //             'message': 'The value must not be null'
    //           }
    //         },
    //         'childFieldMeta': {}
    //       },
    //       'options': {
    //         'fieldName': 'options',
    //         'fieldLabel': 'Options',
    //         'inputType': 'INPUT_TABLE',
    //         'canGet': true,
    //         'canPost': true,
    //         'canPut': false,
    //         'constraintList': {},
    //         'childFieldMeta': {}
    //       },
    //       'questionType': {
    //         'fieldName': 'questionType',
    //         'fieldLabel': 'Type',
    //         'inputType': 'COMBO_BOX',
    //         'canGet': true,
    //         'canPost': true,
    //         'canPut': false,
    //         'constraintList': {
    //           'Size': {
    //             'type': 'Size',
    //             'message': 'The size of this string is not valid',
    //             'min': 15,
    //             'max': 15
    //           },
    //           'NotNull': {
    //             'type': 'NotNull',
    //             'message': 'The value must not be null'
    //           }
    //         },
    //         'childFieldMeta': {},
    //         'fieldDataPool': {
    //           'list': [
    //             {
    //               'labelMap': {},
    //               'id': 'QTYPE__DROPDOWN',
    //               'someLabel': 'Dropdown'
    //             },
    //             {
    //               'labelMap': {},
    //               'id': 'QTYPE_TEXT_INLN',
    //               'someLabel': 'Text Inline'
    //             },
    //             {
    //               'labelMap': {},
    //               'id': 'QTYPE_RADIO_MLT',
    //               'someLabel': 'Radio/Multiplechoice'
    //             },
    //             {
    //               'labelMap': {},
    //               'id': 'QTYPE_CHECK_BOX',
    //               'someLabel': 'Checkbox'
    //             },
    //             {
    //               'labelMap': {},
    //               'id': 'QTYPE_DATE_INPT',
    //               'someLabel': 'Date'
    //             },
    //             {
    //               'labelMap': {},
    //               'id': 'QTYPE_DATE_RANG',
    //               'someLabel': 'Date Range'
    //             },
    //             {
    //               'labelMap': {},
    //               'id': 'QTYPE_____EMOJI',
    //               'someLabel': 'Emoji'
    //             },
    //             {
    //               'labelMap': {},
    //               'id': 'QTYPE_PROGRSBAR',
    //               'someLabel': 'Progresbar'
    //             },
    //             {
    //               'labelMap': {},
    //               'id': 'QTYPE____NUMBER',
    //               'someLabel': 'Number'
    //             }
    //           ],
    //           'pageNo': 1,
    //           'pageSize': -1,
    //           'totalPages': -9,
    //           'totalRecords': 9
    //         }
    //       },
    //       'required': {
    //         'fieldName': 'required',
    //         'fieldLabel': 'Required',
    //         'inputType': 'CHECK_BOX',
    //         'canGet': true,
    //         'canPost': false,
    //         'canPut': false,
    //         'constraintList': {},
    //         'childFieldMeta': {}
    //       }
    //     }
    //   }
    // };
  }

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
        canReset: false
      },
      requestTypeId: {
        class: 'col-12',
        value: 'POOL00000000082',
        display: false,
        selectValue: 'labelMap.requestTypeId',
        canReset: false
      },
      insertDate: {
        display: false,
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
      managerNotes: {
        class: 'col-6',
        display: this.method === 'PUT',
        onTextInputTextarea: true
      },
      directorNotes: {
        class: 'col-6',
        display: this.method === 'PUT',
        onTextInputTextarea: true
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
    this.router.navigate([], {relativeTo: this.route}).then(() => {
      console.log(form);
    });
  }
  // ---------------------------------------------------------------------------------------------
}
