import {NgModule} from '@angular/core';
import {PaginatorComponent} from './paginator/paginator.component';
import {MatButtonModule, MatButtonToggleModule, MatIconModule, MatInputModule, MatSelectModule, MatTooltipModule} from '@angular/material';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonToggleModule
  ],
  exports: [PaginatorComponent]
})
export class PaginatorModule {
}
