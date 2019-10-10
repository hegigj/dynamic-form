import {NgModule} from '@angular/core';
import {TimezonePipe} from './timezone.pipe';
import {OptionPipe} from './option.pipe';

@NgModule({
  declarations: [TimezonePipe, OptionPipe],
  exports: [TimezonePipe, OptionPipe]
})
export class ControlsModule {
}
