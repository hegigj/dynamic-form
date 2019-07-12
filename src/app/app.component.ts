import {Component, OnInit} from '@angular/core';
import {EmployeeService} from './app-services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  meta: any;
  method: string;
  order: any;

  data: any;
  dependencies: any;

  canGet: boolean; // obligatory variable
  getForm: boolean; // obligatory variable

  constructor(private _emplServ: EmployeeService) {}

  ngOnInit() {
    // this.getEmployeeMeta('POST');
    // this.getEmployee();
    // this.getXHMeta('POST');
    this.getXH();
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------- TESTING FORM WITH SOME SERVICES ----------------------------------------------------------

  // ---------------------------------------------------------------------------------------------------------------------------------------
  getEmployeeMeta(method) {
    this._emplServ.getEmployeeMeta().subscribe((fields: any) => {
      this.meta = fields.body.data.fieldMap;
      this.method = method;
      this.order = {
        id: {},
        firstName: {class: 'col-6'},
        lastName: {class: 'col-6'},
        birthdate: {class: 'col-12'},
        email: {class: 'col-12'},
        managerId: {
          class: 'col-6',
          selectValue: 'managerFirstName managerLastName',
          methods: {keyup: this.getEmployees.bind(this), focus: this.getEmployees.bind(this)}},
        directorId: {
          class: 'col-6',
          selectValue: 'directorFirstName directorLastName',
          methods: {keyup: this.getEmployees.bind(this), focus: this.getEmployees.bind(this)}},
        officeNameId: {class: 'col-12', selectValue: 'officeName'}
      };
    });
  }

  getXHMeta(method) {
    this._emplServ.getExtraHourRequestMeta().subscribe((meta: any) => {
      this.meta = meta.body.data.fieldMap;
      this.method = method;
      this.order = this.method === 'POST' ? {
        id: {},
        employeeId: {class: 'col-12', display: false, value: 'EMPL00000000140'},
        insertDate: {display: false, value: new Date().toISOString().split('.')[0]},
        officeNameId: {display: false, value: 'POOL00000000001'},
        startTimestamp: {class: 'col-6'},
        stopTimestamp: {class: 'col-6'},
        countHD: {class: 'col-12'},
        substitutionDates: {class: 'col-12'},
        employeeNotes: {class: 'col-12'}
      } : {
        id: {},
        employeeId: {class: 'col-12', value: 'EMPL00000000140', selectValue: 'labelMap.employeeId'},
        insertDate: {disabled: true, display: false},
        officeNameId: {class: 'col-12', disabled: true, selectValue: 'labelMap.officeNameId'},
        startTimestamp: {class: 'col-6', disableDatePicker: true, disableTimePicker: true},
        stopTimestamp: {class: 'col-6', disableDatePicker: true, disableTimePicker: true},
        countHD: {class: 'col-12', disabled: true},
        employeeNotes: {class: 'col-12', disabled: true},

        substitutionDates: {class: 'col-12', disabled: true, disableDateInputArea: true, disableRemoveDateInputArea: true},
        approvementId: {class: 'col-6', selectValue: 'labelMap.approvementId'},
        managerNotes: {class: 'col-6'},
        authorizationId: {class: 'col-6', selectValue: 'labelMap.authorizationId'},
        directorNotes: {class: 'col-6'},
        processedId: {class: 'col-6'},
        hrOfficeNotes: {class: 'col-6'}
      };
    });
  }

  getXH() {
    const params = {paramBean: {fillFieldLabels: true}};
    this._emplServ.getExtraHourRequest('EMPL00000000115', 'HREQ00000001031', {params: params}).subscribe((res: any) => {
      if (res.status.code === 'STATUS_OK') {
        this.data = res.body.data;
        this.getXHMeta('PUT');
      }
    });
  }

  getEmployee() {
    const params = {paramBean: {fillFieldLabels: true}};
    this._emplServ.getEmployee('EMPL00000000140', {params: params}).subscribe((res: any) => {
      if (res.status.code === 'STATUS_OK') {
        this.data = res.body.data;
        this.getEmployeeMeta('PUT');
      }
    });
  }

  getEmployees(fn?) {
    const params = {paramBean: {fillFieldLabels: true, firstName: fn, pageSize: 12, pageNo: 1}};
    Object.keys(params.paramBean).forEach((key) => { if (params.paramBean[key] === undefined) { delete params.paramBean[key]; } });
    this._emplServ.getEmployeeList({params: params}).subscribe((res: any) => {
      if (res.status.code === 'STATUS_OK') {
        this.dependencies = res.body.data.list;
      }
    });
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------


  showForm(e): void {
    console.log(e);
  }

  // Obligatory function
  getFormData() {
    this.getForm = !(this.getForm);

    setTimeout(() => {
      this.getForm = !(this.getForm);
    }, 300);

    // then execute post or put or patch methods with the obtained form
  }
}
