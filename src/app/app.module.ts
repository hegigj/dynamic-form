// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Material Imports
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatAutocompleteModule, MatButtonModule, MatChipsModule,
  MatDatepickerModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule
} from '@angular/material';

// Components
import { FieldComponent } from './ngx-dynamic-form/field/field.component';
import { FormComponent } from './ngx-dynamic-form/form/form.component';
import { TextInputComponent } from './ngx-dynamic-form/field-types/text-input/text-input.component';
import { DecimalInputComponent } from './ngx-dynamic-form/field-types/decimal-input/decimal-input.component';
import { DateInputComponent } from './ngx-dynamic-form/field-types/date-input/date-input.component';
import { ComboBoxComponent } from './ngx-dynamic-form/field-types/combo-box/combo-box.component';
import { DateInputAreaComponent } from './ngx-dynamic-form/field-types/date-input-area/date-input-area.component';

// Services
import {FormControlService} from './ngx-dynamic-form/controls/form-control.service';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {AmazingTimePickerModule} from 'amazing-time-picker-angular6';
import { ComboBoxMultiComponent } from './ngx-dynamic-form/field-types/combo-box-multi/combo-box-multi.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HeaderInterceptor} from './app-services/header.interceptor';
import {EmployeeService} from './app-services/employee.service';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    FormComponent,
    TextInputComponent,
    DecimalInputComponent,
    DateInputComponent,
    ComboBoxComponent,
    DateInputAreaComponent,
    ComboBoxMultiComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AmazingTimePickerModule,
    NgxSkeletonLoaderModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    EmployeeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true
    },
    FormControlService,
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
