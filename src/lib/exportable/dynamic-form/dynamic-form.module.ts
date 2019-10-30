import {NgModule} from '@angular/core';
// Dynamic Form Imports
import {FormComponent} from './form/form.component';
import {FieldComponent} from './field/field.component';
import {FormArrayComponent} from './field-types/form-array/form-array.component';
import {ComboBoxComponent} from './field-types/combo-box/combo-box.component';
import {ComboBoxMultiComponent} from './field-types/combo-box-multi/combo-box-multi.component';
import {DateInputComponent} from './field-types/date-input/date-input.component';
import {DateInputAreaComponent} from './field-types/date-input-area/date-input-area.component';
import {DecimalInputComponent} from './field-types/decimal-input/decimal-input.component';
import {TextInputComponent} from './field-types/text-input/text-input.component';
// Material Imports
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatChipsModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import {FormArray, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// External Libraries Imports
import {AmazingTimePickerModule} from 'amazing-time-picker-angular6';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
// Services Imports
import {FormControlService} from './controls/form-control.service';
import {GetFormDirective} from './controls/get-form.directive';
import {ResetFormDirective} from './controls/reset-form.directive';
import {ProviderService} from '../../common/controls/provider.service';
import {ControlsModule} from '../../common/controls/controls.module';

@NgModule({
  declarations: [
    FormComponent,
    FieldComponent,
    FormArrayComponent,
    ComboBoxComponent,
    ComboBoxMultiComponent,
    DateInputComponent,
    DateInputAreaComponent,
    DecimalInputComponent,
    TextInputComponent,
    ResetFormDirective,
    GetFormDirective
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AmazingTimePickerModule,
    NgxSkeletonLoaderModule,
    ControlsModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  providers: [
    FormControlService,
    MatDatepickerModule,
    ProviderService
  ],
  exports: [FormComponent, GetFormDirective, ResetFormDirective]
})

export class DynamicFormModule {

}