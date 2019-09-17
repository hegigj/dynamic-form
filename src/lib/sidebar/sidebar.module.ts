import {NgModule} from '@angular/core';
import {InjectComponentDirective} from './controls/inject-component.directive';

@NgModule({
  declarations: [
    InjectComponentDirective
  ],
  exports: [InjectComponentDirective]
})

export class SidebarModule {

}
