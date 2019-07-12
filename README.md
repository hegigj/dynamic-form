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
     
    // Import your NgxDynamicFormModule
    import { NgxDynamicFormModule } from 'dynamic-form-unizkm-hg';
     
    @NgModule({
      declarations: [
        AppComponent,
        ...
      ],
      imports: [
        ...,
        // Import your NgxDynamicFormModule
        NgxDynamicFormModule,
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
              [method]="'PUT'" 
              [appearance]="'outline'"
              
              [returnForm]="triggerToGetFormData" 
              [resetForm]="triggerToResetFormData"
              
              (getValidity)="formValid = $event"
              (getFormData)="formData = $event"
              
              class="expand-full-width" *ngIf="labels"></app-form>
          
              
    <button (click)="postFormData()" [disabled]="!valid">
      Insert
    </button>
    <button color="warn" (click)="resetFormData()">
      Reset
    </button>
    
    <button (click)="putFormData()" [disabled]="!valid">
      Update
    </button>

Use in Component.ts:

    import {Component, Input, OnInit} from '@angular/core';
    import {FieldOrderModel} from 'dynamic-form-unizkm-hg/ngx-dynamic-form/models/field-order.model';
    
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
      
      triggerToResetFormData: boolean = false;
      triggerToGetFormData: boolean = false;
      
      valid: boolean;
      formData: any;
    
      constructor(...) { }
    
      ngOnInit() {
        ...
      }
      
      private _getEmployeeMeta() {
        this. ... .subscribe( (response: any) => {
          this.labels = response.body.data.fieldMap;
        })
      }
    
      private _getEmployee(employeeId) {
        this. ...(employeeId).subscribe( (response: any) => {
          this.employee = response.body.data;
        })
      }
    
      getEmployees(firstName?) {
        this. ... .subscribe((response: any) => {
          this.dependencies = response.body.data.list;
        });
      }
                        
      // dynamic functions
      postFormData() {
        this.triggerToGetFormData = true;
        
        setTimeout(() => {
        
          // your service
          ...
          
        });
      }
    
      putFormData() {
        this.triggerToGetFormData = true;
    
        setTimeout(() => {
        
          // your service
          ...
          
        });
      }
    
      resetFormData() {
        this.triggerToResetFormData = !(this.triggerToResetFormData);
        setTimeout(() => {
          this.triggerToResetFormData = !(this.triggerToResetFormData);
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
        required?: boolean;
        methods?: Methods;
    }
    export declare class Methods {
        [command: string]: Function;
    }
    export declare type BootstrapClass = 'col-12' | 'col-6' | 'col-3';
    
6: ReturnForm Input, [returnForm] receives as input a boolean value in "Create", "Update", "Delete" button action clicks

7: ResetForm Input, [resetForm] receives as input a boolean value in "Reset", "Clear" button action clicks

## Outputs

1: GetValidity Output, (getValidity) returns a boolean to enable or disable form action buttons

2: GetFormData Output, (getFormData) return a data object
