import {NgModule} from '@angular/core';
// Dynamic Form Imports
import {FormComponent} from './form/form.component';
import {FieldComponent} from './field/field.component';
import {ComboBoxComponent} from './field-types/combo-box/combo-box.component';
import {ComboBoxMultiComponent} from './field-types/combo-box-multi/combo-box-multi.component';
import {DateInputComponent} from './field-types/date-input/date-input.component';
import {DateInputAreaComponent} from './field-types/date-input-area/date-input-area.component';
import {DecimalInputComponent} from './field-types/decimal-input/decimal-input.component';
import {TextInputComponent} from './field-types/text-input/text-input.component';
// Dynamic Filter Imports
import {FilterComponent} from './filter/filter.component';
import {TextComponent} from './filter-type/text/text.component';
import {DateComponent} from './filter-type/date/date.component';
import {DateBetweenComponent} from './filter-type/date-between/date-between.component';
import {ComboComponent} from './filter-type/combo/combo.component';
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
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// External Libraries Imports
import {AmazingTimePickerModule} from 'amazing-time-picker-angular6';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
// Services Imports
import {FormControlService} from './controls/form-providers/form-control.service';
import {GetFormDirective} from './controls/form-providers/get-form.directive';
import {ResetFormDirective} from './controls/form-providers/reset-form.directive';
import {FilterControlService} from './controls/filter-providers/filter-control.service';
import {InjectComponentDirective} from './controls/sidebar-providers/inject-component.directive';
import {SharedService} from './controls/shared.service';
import {DecimalComponent} from './filter-type/decimal/decimal.component';

@NgModule({
  declarations: [
    FilterComponent,
    TextComponent,
    ComboComponent,
    DateComponent,
    DateBetweenComponent,
    DecimalComponent,
    FormComponent,
    FieldComponent,
    ComboBoxComponent,
    ComboBoxMultiComponent,
    DateInputComponent,
    DateInputAreaComponent,
    DecimalInputComponent,
    TextInputComponent,
    InjectComponentDirective,
    ResetFormDirective,
    GetFormDirective
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AmazingTimePickerModule,
    NgxSkeletonLoaderModule,
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
    FilterControlService,
    MatDatepickerModule,
    SharedService
  ],
  exports: [FilterComponent, FormComponent, GetFormDirective, ResetFormDirective, InjectComponentDirective]
})

export class DynamicFormModule {

}
