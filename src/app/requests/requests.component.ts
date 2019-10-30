import {Component, OnDestroy, OnInit} from '@angular/core';
import {ListResponse} from '../app-models/list-response';
import {Abstract} from '../app-models/abstract';
import {MetadataResponse} from '../app-models/metadata-response';
import {EmployeeService} from '../app-services/employee.service';
import {RequestComponent} from '../request/request.component';
import {ComponentInjector, SidebarService} from '../../lib/exportable/sidebar/controls/sidebar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FilterOrder} from '../../lib/exportable/dynamic-filter/models/filter-order';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Request} from '../app-models/request';
import index from '@angular/cli/lib/cli';
import {min} from 'rxjs/operators';

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
  order: FilterOrder | any;
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
      clickParams: 'POOL00000000078',
      disabled: true
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

  private _optimumSolution = new BehaviorSubject(null);
  matrix = [[5, 3, 2, 8], [7, 9, 2, 6], [6, 4, 5, 7], [5, 7, 7, 8]];

  constructor(private requestService: EmployeeService,
              private sidebarService: SidebarService,
              private router: Router,
              private route: ActivatedRoute) {

    // FILTER ORDER -------
    this.order = {
      requestTypeId: {inputType: 'COMBO_BOX'},
      validationDate: {},
      status: {inputType: 'COMBO_BOX'}
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

    this.assignmentProblem().then();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private _initControl() {
    this._getRequestMeta();
    this._getRequestsList();
  }



  // --------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------- ASSIGNMENT PROBLEM ----------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------------

  async assignmentProblem() {
    let matrix = this.matrix;
    console.table(matrix);
    matrix = this.minRowScan(matrix);
    matrix = this.minColumnScan(matrix);
    this.rowAndColumnScanZeros(matrix);
    this._optimumSolution$.subscribe((response) => {
      matrix = response;
      const idealTime = [];
      matrix.forEach((position: any) => {
        idealTime.push(this.matrix[position.row][position.column]);
      });
      console.log('IDEAL TIME: ', idealTime);
    });
  }

  get _optimumSolution$(): Observable<any> {
    return this._optimumSolution.asObservable();
  }

  minRowScan(matrix) {
    // assume matrix is a square matrix ex: 4x4 or 3x3 or ...
    const minRowValues = [];
    matrix.forEach((row) => {
      let minCell = 1000;
      row.forEach((cell) => {
        if (cell < minCell) {
          minCell = cell;
        }
      });
      minRowValues.push(minCell);
    });
    matrix.forEach((row, i) => {
      row.forEach((cell, j) => {
        matrix[i][j] -= minRowValues[i];
      });
    });
    return matrix;
  }

  minColumnScan(matrix) {
    // assume matrix is a square matrix ex: 4x4 or 3x3 or ...
    const minColumnValues = [];
    for (let i = 0; i < matrix.length; i++) {
      let minCell = 1000;
      matrix.forEach((row) => {
        if (row[i] < minCell) {
          minCell = row[i];
        }
      });
      minColumnValues.push(minCell);
    }
    for (let i = 0; i < matrix.length; i++) {
      matrix.forEach((row, j) => {
        matrix[j][i] -= minColumnValues[i];
      });
    }
    return matrix;
  }

  rowAndColumnScanZeros(matrix, useDiagonals?) {
    console.log('Row and column scan ZEROS');
    if (useDiagonals) {
      matrix = this.rowDiagonalScan(matrix);
    } else {
      matrix.forEach((row, i) => {
        row.forEach((cell, j) => {
          matrix[i][j] = {value: matrix[i][j], horzCovered: false, vertCovered: false, marked: false};
        });
      });
      const cellIndex = [];
      matrix = this.rowScan(matrix, cellIndex);
      matrix = this.columnScan(matrix, cellIndex);
    }
    this.areAllZerosCovered(matrix);
  }

  rowScan(matrix, cellIndex) {
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, j) => {
        if (cell.value === 0 && !cell.vertCovered) {
          cellIndex.push(j);
        }
      });
      if (cellIndex.length === 1) {
        for (let i = 0; i < matrix.length; i++) {
          Object.assign(matrix[i][cellIndex[0]], rowIndex === i ? {vertCovered: true, marked: true} : {vertCovered: true});
        }
      }
      cellIndex.splice(0, cellIndex.length);
    });
    return matrix;
  }

  rowDiagonalScan(matrix) {
    const cellIndex = [];
    matrix.forEach((row, rowIndex) => {
      let newIndex: number;
      if (newIndex) {
        if (row[newIndex + 1] && row[newIndex + 1].value === 0 && !row[newIndex + 1].vertCovered) {
          cellIndex.push(newIndex + 1);
        } else if (row[newIndex - 1] && row[newIndex - 1].value === 0 && !row[newIndex - 1].vertCovered) {
          cellIndex.push(newIndex - 1);
        }
      } else {
        row.forEach((cell, j) => {
          if (cell.value === 0 && !cell.vertCovered) {
            cellIndex.push(j);
          }
        });
      }
      for (let i = 0; i < matrix.length; i++) {
        Object.assign(matrix[i][cellIndex[0]], rowIndex === i ? {vertCovered: true, marked: true} : {vertCovered: true});
      }
      newIndex = cellIndex[0];
      cellIndex.splice(0, cellIndex.length);
    });
    return matrix;
  }

  columnScan(matrix, cellIndex) {
    for (let i = 0; i < matrix.length; i++) {
      matrix.forEach((row, j) => {
        if (row[i].value === 0 && !row[i].vertCovered && !row[i].horzCovered) {
          cellIndex.push(j);
        }
      });
      if (cellIndex.length === 1) {
        for (let j = 0; j < matrix[i].length; j++) {
          if (!matrix[cellIndex[0]][j].marked) {
            Object.assign(matrix[cellIndex[0]][j], i === j ? {horzCovered: true, marked: true} : {horzCovered: true});
          }
        }
      }
      cellIndex.splice(0, cellIndex.length);
    }
    return matrix;
  }

  areAllZerosCovered(matrix) {
    console.log('Are all ZEROS covered ?');
    let zerosAreCovered = true;
    matrix.forEach((row) => {
      row.forEach((cell) => {
        if (cell.value === 0 && !(cell.horzCovered || cell.vertCovered)) {
          zerosAreCovered = false;
        }
      });
    });
    if (zerosAreCovered) {
      console.log('- Yes they are');
      this.markedZerosEqualToRows(matrix);
    } else {
      console.log('- No they aren\'t');
      this.rowAndColumnScanZeros(matrix, true);
    }
  }

  markedZerosEqualToRows(matrix) {
    console.log('Are no. of squares equal to the no. of rows of the matrix ?');
    const markedZeros = [];
    matrix.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.marked) {
          markedZeros.push({row: i, column: j});
        }
      });
    });
    if (markedZeros.length === matrix.length) {
      console.log('- Yes there are');
      this._optimumSolution.next(markedZeros);
    } else {
      console.log('- No there aren\'t');
      this.identifyUncoveredValue(matrix);
    }
  }

  identifyUncoveredValue(matrix) {
    console.log('Identify uncovered MIN VALUE');
    let minCell = 1000;
    matrix.forEach((row) => {
      row.forEach((cell) => {
        if (cell.value < minCell && !cell.horzCovered && !cell.vertCovered) {
          minCell = cell.value;
        }
      });
    });
    matrix.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell.horzCovered && !cell.vertCovered) {
          matrix[i][j] = matrix[i][j].value - minCell;
        } else if (cell.horzCovered && cell.vertCovered) {
          matrix[i][j] = matrix[i][j].value + minCell;
        } else {
          matrix[i][j] = matrix[i][j].value;
        }
      });
    });
    this.rowAndColumnScanZeros(matrix);
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------------



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
    console.log(event);
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
