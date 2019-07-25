# DynamicFormUniZKM HG

Dynamic Form UniZKM Library, creates form with fields and skeleton during loading fields

Creates Form Group with Form Controls and Validators

## Installation

    $ npm i dynamic-form-unizkm-hg

## Usage

Import NgxDynamicFormModule into AppModule: 
    
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
     
    import { AppComponent } from './app.component';
     
    // Import your DynamicFormModule
    import { DynamicFormModule } from 'dynamic-form-unizkm-hg';
     
    @NgModule({
      declarations: [
        AppComponent,
        ...
      ],
      imports: [
        ...,
        // Import your DynamicFormModule
        DynamicFormModule,
        ...
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
    
Use in Component.html:

    <app-form [fields]="labels" 
              [values]="employee"
              [fieldDataPool]="dependencies"
              
              [order]="order" 
              [method]="method" 
              [appearance]="'outline'"
              
              (getValidity)="formValid = $event"
              
              class="expand-full-width" *ngIf="labels"></app-form>
          
              
    <button appGetForm (form)="postFormData($event)" [disabled]="!valid">
      Insert
    </button>
    <button appResetForm>
      Reset
    </button>
    
    <button appGetForm (form)="putFormData($event)" [disabled]="!valid">
      Update
    </button>

Use in Component.ts:

    import {Component, Input, OnInit} from '@angular/core';
    import {FieldOrderModel} from 'dynamic-form-unizkm-hg/dynamic-form/models/field-order.model';
    
    @Component({
      selector: 'app-employee',
      templateUrl: './employee.component.html',
      styleUrls: ['./employee.component.css']
    })
    export class EmployeeComponent implements OnInit {
      ...
      
      labels: any;
      employee: any:
      dependencies: any:
      
      // dynamic form requirement variables
      order: FieldOrderModel = {
        id: {
          disable: true
        },
        firstName: {
          class: 'col-6'
        },
        lastName: {
          class: 'col-6'
        },
        birthdate: {
          class: 'col-12',
          disableTimePicker: true
        },
        email: {
          class: 'col-12'
        },
        managerId: {
          class: 'col-6',
          selectValue: 'managerFirstName managerLastName',
          methods: {
            keyup: this.getEmployees.bind(this),
            focus: this.getEmployees.bind(this)
          }
        },
        directorId: {
          class: 'col-6',
          selectValue: 'directorFirstName directorLastName',
          methods: {
            keyup: this.getEmployees.bind(this),
            focus: this.getEmployees.bind(this)
          }
        },
        officeNameId: {
          class: 'col-12',
          selectValue: 'officeName',
          multi: true
        }
      };
      method: string;
      valid: boolean;
      formData: any;
    
      constructor(...) { }
    
      ngOnInit() {
        ...
      }
      
      private _getEmployeeMeta() {
        this. ... .subscribe( (response: any) => {
          this.labels = response.body.data.fieldMap;
          this.method = 'POST';
        })
      }
    
      private _getEmployee(employeeId) {
        this. ...(employeeId).subscribe( (response: any) => {
          this.employee = response.body.data;
          this.method = 'PUT';
        })
      }
    
      getEmployees(firstName?) {
        this. ... .subscribe((response: any) => {
          this.dependencies = response.body.data.list;
        });
      }
                        
      // dynamic functions
      postFormData(form: any) {
        formData = form;
        
        setTimeout(() => {
        
          // your service
          ...
          
        });
      }
    
      putFormData(form: any) {
        formData = form;
        
        setTimeout(() => {
        
          // your service
          ...
          
        });
      }
    }


## Inputs

1: Fields input, [fields] receives as input KG OPTIONS Service:
    
    "lastName":{
      "fieldName": "lastName",
      "fieldLabel": "Cognome",
      "inputType": "TEXT_INPUT",
      "canGet": true,
      "canPost": true,
      "canPut": true,
      "constraintList":{},
      "childFieldMeta":{}
    },
    "graduateCourseName":{
      "fieldName": "graduateCourseName",
      "fieldLabel": "Corso di Laurea ",
      "inputType": "TEXT_INPUT",
      "canGet": true,
      "canPost": true,
      "canPut": true,
      "constraintList":{},
      "childFieldMeta":{}
    },
    "registrationDate":{
      "fieldName": "registrationDate",
      "fieldLabel": "Data di amissione",
      "inputType": "DATE_INPUT",
      "canGet": true,
      "canPost": true,
      "canPut": true,
      "constraintList":{},
      "childFieldMeta":{}
    }
    
  And accepts inputType or {order['...'].multi: true, ...}:
  
    "TEXT_INPUT"                                                        text input field
    "DECIMAL_INPUT"                                                   number input field
    "DATA_INPUT"                                                   timestamp input field
    "TEXT_INPUT_AREA"                                    timestamp multiple inputs field
    "COMBO_BOX"                                                       autocomplete field
    "COMBO_BOX" + order['...'].multi: true;       multiple autocomplete with chips field
    
  And accepts constraintList, Java Bean Validation:
  
    "Min", "Max", "Pattern", "Email", "Size", "NotNull"
  
2: Values Input, [values] receives as input any data object that it keys match field keys above

3: FieldDataPool Input, [fieldDataPool] receives as input any data object list that contains "id" and "someLabel"

4: Method Input, [method] receives as input only "PUT" or "POST" methods

5: Order Input, [order] receives as input data object as this format:

    id: {
      disabled: true;
    },
    firstName: {
      class: 'col-6'
    },
    lastName: {
      class: 'col-6'
    },
    birthdate: {
      class: 'col-12',
      disableTimePicker: true
    },
    email: {
      class: 'col-12'
    },
    managerId: {
      class: 'col-6',
      selectValue: 'managerFirstName managerLastName',
      methods: {
        keyup: this.passYourFunctionReference.bind(this),
        focus: this.passYourFunctionReference.bind(this)
      }
    },
    directorId: {
      class: 'col-6',
      selectValue: 'directorFirstName directorLastName',
      methods: {
        keyup: this.passYourFunctionReference.bind(this),
        focus: this.passYourFunctionReference.bind(this)
      }
    },
    officeNameId: {
      class: 'col-12',
      selectValue: 'officeName',
      multi: true
    } 
    
  Order can contain:
  
    // You can import FieldOrderModel class to your project to have access to all Order autosuggestions 
    export declare class FieldOrderModel {
        [key: string]: OrderConfigs;
    }
    
    
    export declare class OrderConfigs {
        class?: BootstrapClass;
        value?: string | any;
        selectValue?: string | any;
        multi?: boolean;
        display?: boolean;
        disableDatePicker?: boolean;
        disableTimePicker?: boolean;
        disableDateInputArea?: boolean;
        disableRemoveDateInputArea?: boolean;
        disabled?: boolean;
        canReset?: boolean;
        required?: boolean;
        methods?: Methods;
    }
    export declare class Methods {
        [command: string]: Function;
    }
    export declare type BootstrapClass = 'col-12' | 'col-6' | 'col-3';
    
## Outputs

1: GetValidity Output, (getValidity) returns a boolean to enable or disable form action buttons

## Click Listeners

1: AppGetForm, put on your "Create" or "Update" buttons 'appGetForm' and (form)="yourFunction($event)".
   On click you will receive back the form as an object.
   
2: AppResetForm, put on your "Reset" or "Cancel" buttons 'appResetForm'.
   On click form will be reset.
