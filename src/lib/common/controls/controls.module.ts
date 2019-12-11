import {NgModule} from '@angular/core';
import {TimezonePipe} from './timezone.pipe';
import {OptionPipe} from './option.pipe';
import {ComboDisplayPipe} from './combo-display.pipe';

@NgModule({
  declarations: [TimezonePipe, OptionPipe, ComboDisplayPipe],
  exports: [TimezonePipe, OptionPipe, ComboDisplayPipe]
})
export class ControlsModule {
}
