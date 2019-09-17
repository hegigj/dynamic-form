import {NgModule} from '@angular/core';
import {AvatarModule} from 'ngx-avatar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatPaginatorModule, MatTooltipModule} from '@angular/material';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {TableComponent} from './table/table.component';
import {LabelsComponent} from './labels/labels.component';
import {DataComponent} from './data/data.component';

@NgModule({
  declarations: [
    TableComponent,
    LabelsComponent,
    DataComponent
  ],
  imports: [
    BrowserAnimationsModule,
    NgxSkeletonLoaderModule,
    AvatarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  exports: [TableComponent]
})

export class DynamicTableModule {

}
