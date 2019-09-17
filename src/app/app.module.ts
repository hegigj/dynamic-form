// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Material Imports
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule, MatButtonModule, MatChipsModule,
  MatDatepickerModule, MatExpansionModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatMenuModule,
  MatNativeDateModule, MatPaginatorModule,
  MatSelectModule, MatSidenavModule
} from '@angular/material';

// Services
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HeaderInterceptor} from './app-services/header.interceptor';
import {EmployeeService} from './app-services/employee.service';

import {DynamicFormModule} from '../lib/dynamic-form/dynamic-form.module';
import {DynamicFilterModule} from '../lib/dynamic-filter/dynamic-filter.module';
import {DynamicTableModule} from '../lib/dynamic-table/dynamic-table.module';
import {SidebarService} from '../lib/sidebar/controls/sidebar.service';
import {AvatarModule} from 'ngx-avatar';

// Components
import { RequestComponent } from './request/request.component';
import { RequestsComponent } from './requests/requests.component';
import { MainComponent } from './main/main.component';
import {InjectComponentDirective} from '../lib/sidebar/controls/inject-component.directive';

const router: Routes = [
  {
    path: '',
    redirectTo: '/module/requests',
    pathMatch: 'full'
  },
  {
    path: 'module',
    component: MainComponent,
    children: [
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
    DynamicTableModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatExpansionModule,
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
    RequestComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
