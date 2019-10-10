import {NgModule} from '@angular/core';
import {LabelStatusDirective} from './control/label-status.directive';

@NgModule({
  declarations: [LabelStatusDirective],
  exports: [LabelStatusDirective]
})
export class LabelStatusModule {
}
