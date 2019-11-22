// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Material Imports
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule, MatButtonModule, MatChipsModule,
  MatDatepickerModule, MatDialogModule, MatExpansionModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatMenuModule,
  MatNativeDateModule, MatPaginatorModule,
  MatSelectModule, MatSidenavModule, MatSnackBarModule, MatTooltipModule
} from '@angular/material';

// Services
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HeaderInterceptor} from './app-services/header.interceptor';
import {EmployeeService} from './app-services/employee.service';

import {DynamicFormModule} from '../lib/exportable/dynamic-form/dynamic-form.module';
import {DynamicFilterModule} from '../lib/exportable/dynamic-filter/dynamic-filter.module';
import {SidebarService} from '../lib/exportable/sidebar/controls/sidebar.service';
import {AvatarModule} from 'ngx-avatar';

// Components
import { RequestComponent } from './request/request.component';
import { RequestsComponent } from './requests/requests.component';
import { MainComponent } from './main/main.component';
import {InjectComponentDirective} from '../lib/exportable/sidebar/controls/inject-component.directive';
import {PaginatorModule} from '../lib/exportable/paginator/paginator.module';
import {LabelStatusModule} from '../lib/exportable/label-status/label-status.module';
import {BadgesComponent} from './badges/badges.component';
import {BadgeComponent} from './badge/badge.component';
import {BadgeDialogComponent} from './badge-dialog/badge-dialog.component';

const router: Routes = [
  {
    path: '',
    redirectTo: '/module/student-badges',
    pathMatch: 'full'
  },
  {
    path: 'module',
    component: MainComponent,
    children: [
      {
        path: 'student-badges',
        component: BadgesComponent
      },
      {
        path: 'requests',
        component: RequestsComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    InjectComponentDirective,
    RequestComponent,
    RequestsComponent,
    BadgesComponent,
    BadgeComponent,
    BadgeDialogComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AvatarModule,
    RouterModule.forRoot(router),
    BrowserAnimationsModule,
    DynamicFormModule,
    DynamicFilterModule,
    PaginatorModule,
    LabelStatusModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule
  ],
  providers: [
    EmployeeService,
    SidebarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true
    },
    MatDatepickerModule
  ],
  entryComponents: [
    RequestComponent,
    BadgeComponent,
    BadgeDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
