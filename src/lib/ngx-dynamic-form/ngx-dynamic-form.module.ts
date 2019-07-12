import {NgModule} from '@angular/core';
import {FormComponent} from './form/form.component';
import {FieldComponent} from './field/field.component';
import {ComboBoxComponent} from './field-types/combo-box/combo-box.component';
import {ComboBoxMultiComponent} from './field-types/combo-box-multi/combo-box-multi.component';
import {DateInputComponent} from './field-types/date-input/date-input.component';
import {DateInputAreaComponent} from './field-types/date-input-area/date-input-area.component';
import {DecimalInputComponent} from './field-types/decimal-input/decimal-input.component';
import {TextInputComponent} from './field-types/text-input/text-input.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatChipsModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule
} from '@angular/material';
import {AmazingTimePickerModule} from 'amazing-time-picker-angular6';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {FormControlService} from './controls/form-control.service';

@NgModule({
  declarations: [
    FormComponent,
    FieldComponent,
    ComboBoxComponent,
    ComboBoxMultiComponent,
    DateInputComponent,
    DateInputAreaComponent,
    DecimalInputComponent,
    TextInputComponent
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
    MatNativeDateModule
  ],
  providers: [
    FormControlService,
    MatDatepickerModule
  ],
  exports: [FormComponent]
})

export class NgxDynamicFormModule {

}
