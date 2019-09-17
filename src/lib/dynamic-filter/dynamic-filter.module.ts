import {NgModule} from '@angular/core';
// Dynamic Filter Imports
import {FilterComponent} from './filter/filter.component';
import {TextComponent} from './filter-type/text/text.component';
import {DateComponent} from './filter-type/date/date.component';
import {DateBetweenComponent} from './filter-type/date-between/date-between.component';
import {ComboComponent} from './filter-type/combo/combo.component';
import {DecimalComponent} from './filter-type/decimal/decimal.component';
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
// Services Imports
import {FilterControlService} from './controls/filter-control.service';
import {ProviderService} from '../controls/provider.service';
import {OptionPipe} from './controls/option.pipe';

@NgModule({
  declarations: [
    FilterComponent,
    TextComponent,
    ComboComponent,
    DateComponent,
    DateBetweenComponent,
    DecimalComponent,
    OptionPipe
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AmazingTimePickerModule,
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
    FilterControlService,
    MatDatepickerModule,
    ProviderService
  ],
  exports: [FilterComponent]
})

export class DynamicFilterModule {

}
