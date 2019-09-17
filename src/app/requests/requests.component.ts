import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ListResponse} from '../app-models/list-response';
import {Abstract} from '../app-models/abstract';
import {MetadataResponse} from '../app-models/metadata-response';
import {EmployeeService} from '../app-services/employee.service';
import {RequestComponent} from '../request/request.component';
import {ComponentInjector, SidebarService} from '../../lib/sidebar/controls/sidebar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FilterOrder} from '../../lib/dynamic-filter/models/filter-order';
import {MatPaginator} from '@angular/material';
import {Subscription} from 'rxjs';
import {Request} from '../app-models/request';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') page: MatPaginator;

  subs: Subscription;

  dependencies: any[];

  labels: Request<MetadataResponse<Abstract<string>>>;
  requestsList: ListResponse<Request<string>>;
  tableData = {
    pageSize: 6,
    totalRecords: 12,
  };

  type = 'me';
  params = {
    paramBean: {
      fillFieldLabels: true,
      type: 'me',
      pageSize: 6,
      pageNo: 1
    }
  };

  filters: MetadataResponse<Abstract<string>>;
  order: FilterOrder;

  requestsTypes: Abstract<string>[];
  requestIconMap: {[pool: string]: string} = {
    'POOL00000000081': 'access_time',
    'POOL00000000078': 'work',
    'POOL00000000079': 'date_range',
    'POOL00000000082': 'swap_horiz',
    'POOL00000000080': 'style'
  };

  constructor(private requestService: EmployeeService,
              private sidebarService: SidebarService,
              private router: Router,
              private route: ActivatedRoute) {
    this.order = {
      requestTypeId: {},
      validationDate: {},
      status: {}
    };
  }

  ngOnInit() {
    this.subs = this.sidebarService.injectComponentToComponent.subscribe((res: ComponentInjector) => {
      if (res && !res.control) { this._initControl(); }
    });
    this._initControl();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private _initControl() {
    this._getRequestMeta();
    this._getRequestsList();
  }

  private _checkURL() {
    if (this.route.snapshot.queryParams['requestType'] && this.route.snapshot.queryParams['id']) {
      const requestType = this.route.snapshot.queryParams['requestType'];
      const requestId = this.route.snapshot.queryParams['id'];
      const statusId = '';
      const status = '';
      this.openRequest(requestType, requestId, {id: statusId, someLabel: status});
    } else if (this.route.snapshot.queryParams['id']) {
      this.newRequest(this.route.snapshot.queryParams['id']);
    }
  }

  private _getRequestMeta() {
    this.requestService.getRequestMeta().subscribe((labels: any) => {
      if (labels.status.code === 'STATUS_OK') {
        this.requestsTypes = labels.body.data.fieldMap.requestTypeId.fieldDataPool.list;
        this.filters = labels.body.data.filterMap;
        this.labels = labels.body.data.fieldMap;
      }
    });
  }

  private _getRequestsList() {
    this.requestService.getRequestList({params: this.params}).subscribe((response: any) => {
      if (response.status.code === 'STATUS_OK') {
        this.tableData.totalRecords = response.body.data.totalRecords;
        this.requestsList = response.body.data;
        this._checkURL();
      }
    });
  }

  switchRequest(type) {
    this.params.paramBean.type = type;
    if (this.params.paramBean.type !== this.type) {
      this.type = this.params.paramBean.type;
      this.params.paramBean.pageNo = 1;
      this.page.pageIndex = 0;
    } this._getRequestsList();
  }

  refreshList(event) {
    this.params.paramBean.pageNo = event.pageIndex + 1;
    this.params.paramBean.pageSize = event.pageSize;
    this.tableData.pageSize = event.pageSize;
    this._getRequestsList();
  }

  filtering(event) {
    Object.keys(this.order).forEach((key) => {
      if (this.params.paramBean[key]) { delete this.params.paramBean[key]; }
    }); Object.assign(this.params.paramBean, event);
    this._getRequestsList();
  }

  newRequest(type: string) {
    switch (type) {
      case 'POOL00000000082':
      case 'new-substituted-holidays-request':
        this.sidebarService.setComponent(
          true,
          {id: 'new-substituted-holidays-request'},
          RequestComponent,
          {employeeId: 'EMPL00000000140'}
        );
        break;
    }
  }

  openRequest(type, requestId, requestStatus) { const params = {requestType: type, id: requestId};
    switch (type) {
      case 'POOL00000000082':
        this.sidebarService.setComponent(true, params, RequestComponent, {
          employeeId: 'EMPL00000000140',
          requestId: requestId,
          requestStatus: requestStatus
        }); break;
    }
  }
}
