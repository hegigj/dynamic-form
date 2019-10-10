import {Component, OnDestroy, OnInit} from '@angular/core';
import {ListResponse} from '../app-models/list-response';
import {Abstract} from '../app-models/abstract';
import {MetadataResponse} from '../app-models/metadata-response';
import {EmployeeService} from '../app-services/employee.service';
import {RequestComponent} from '../request/request.component';
import {ComponentInjector, SidebarService} from '../../lib/exportable/sidebar/controls/sidebar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FilterOrder} from '../../lib/exportable/dynamic-filter/models/filter-order';
import {Subscription} from 'rxjs';
import {Request} from '../app-models/request';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit, OnDestroy {
  subs: Subscription;
  dependencies: any[];
  labels: Request<MetadataResponse<Abstract<string>>>;
  requestsList: ListResponse<Request<string>>;
  params = {
    paramBean: {
      fillFieldLabels: true,
      type: 'me',
      pageSize: 6,
      pageNo: 1
    }
  };

  // FILTER ----------------------------------
  filters: MetadataResponse<Abstract<string>>;
  order: FilterOrder;
  // -----------------------------------------

  // LABEL STATUS -----------------
  statusMap: Abstract<string>[];
  // ------------------------------

  // PAGINATOR BUTTONS -------------------------------
  button = [
    {
      type: 'icon',
      text: 'access_time',
      tooltip: 'Add Extra Hours',
      click: this.newRequest.bind(this),
      clickParams: 'POOL00000000081',
      disabled: true
    },
    {
      type: 'icon',
      text: 'work',
      tooltip: 'Add Mission',
      click: this.newRequest.bind(this),
      clickParams: 'POOL00000000078'
    },
    {
      type: 'icon',
      text: 'date_range',
      tooltip: 'Add Holidays and Permission',
      click: this.newRequest.bind(this),
      clickParams: 'POOL00000000079',
      disabled: true
    },
    {
      type: 'icon',
      text: 'swap_horiz',
      tooltip: 'Add Substituted Holidays',
      click: this.newRequest.bind(this),
      clickParams: 'POOL00000000082'
    },
    {
      type: 'icon',
      text: 'style',
      tooltip: 'Add Badge Fail',
      click: this.newRequest.bind(this),
      clickParams: 'POOL00000000080',
      disabled: true
    }
  ];
  // -------------------------------------------------

  // PAGINATOR DATA -------
  tableData = {
    pageNo: 1,
    pageSize: 6,
    totalPages: 2,
    totalRecords: 12,
  };
  // ----------------------

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

    // FILTER ORDER -------
    this.order = {
      requestTypeId: {},
      validationDate: {},
      status: {}
    };
    // --------------------

  }

  ngOnInit() {

    // SIDEBAR OBSERVER --------------------------------------------------------------------------------------
    this.subs = this.sidebarService.injectComponentToComponent.subscribe((res: ComponentInjector) => {
      if (res && !res.control) { this._initControl(); }
    });
    // -------------------------------------------------------------------------------------------------------

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
      this.openRequest(requestType, requestId, this.requestsList.list.find(req => req.id === requestId).labelMap.status);
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

        // LABEL STATUS MAPPING CALL ------
        this.setStatusLabelingMap(labels);
        // --------------------------------
      }
    });
  }

  private _getRequestsList() {
    this.requestService.getRequestList({params: this.params}).subscribe((response: any) => {
      if (response.status.code === 'STATUS_OK') {

        // PAGINATOR FILLING DATA ------------------------------
        this.tableData = {
          pageNo: response.body.data.pageNo,
          pageSize: response.body.data.pageSize,
          totalPages: response.body.data.totalPages,
          totalRecords: response.body.data.totalRecords,
        };
        // -----------------------------------------------------

        this.requestsList = response.body.data;
        this._checkURL();
      }
    });
  }

  switchRequest(type) {
    this.params.paramBean.type = type;
    this._getRequestsList();
  }

  // LABEL STATUS MAP TO STATUS "labelColor" ------------------------------------------------
  setStatusLabelingMap(label: any) {
    this.statusMap = label.body.data.fieldMap.status.fieldDataPool.list
      .map((res: Abstract<string>) => {
        Object.assign(res, {
          labelColor: res.id === 'POOL00000000085' ?
            '#366cf3' : res.id === 'POOL00000000087' ?
              '#1dc9b7' : res.id === 'POOL00000000084' || res.id === 'POOL00000000083' ?
                '#ffb822' : '#f44336'
        });
        return res;
      });
  }
  // ----------------------------------------------------------------------------------------

  // PAGINATOR FUNCTION -------------------------------------
  refreshList(event) {
    this.tableData = event;
    this.params.paramBean.pageNo = this.tableData.pageNo;
    this.params.paramBean.pageSize = this.tableData.pageSize;
    this._getRequestsList();
  }
  // --------------------------------------------------------

  // FILTER FUNCTION --------------------------------------
  filtering(event) {
    Object.keys(this.order).forEach((key) => {
      if (this.params.paramBean[key]) {
        delete this.params.paramBean[key];
      }
    });
    Object.assign(this.params.paramBean, event);
    this._getRequestsList();
  }
  // ------------------------------------------------------

  newRequest(type: string) {
    switch (type) {
      case 'POOL00000000082':
      case 'new-substituted-holidays-request':

        // SIDEBAR INJECTING COMPONENT --------------------------
        this.sidebarService.setComponent(
          true,
          {id: 'new-substituted-holidays-request'},
          RequestComponent,
          {employeeId: 'EMPL00000000140'}
        );
        // ------------------------------------------------------

        break;
    }
  }

  openRequest(type, requestId, requestStatus) { const params = {requestType: type, id: requestId};
    switch (type) {
      case 'POOL00000000082':

        // SIDEBAR INJECTING COMPONENT -----------------------------------------------------
        this.sidebarService.setComponent(true, params, RequestComponent, {
          employeeId: 'EMPL00000000140',
          requestId: requestId,
          requestStatus: requestStatus,
          statusArray: this.statusMap
        });
        // ---------------------------------------------------------------------------------

        break;
    }
  }
}
