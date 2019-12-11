import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Students} from '../app-models/students';
import {MetadataResponse} from '../app-models/metadata-response';
import {Abstract} from '../app-models/abstract';
import {FilterOrder} from '../../lib/exportable/dynamic-filter/models/filter-order';
import {ListResponse} from '../app-models/list-response';
import {ParamBean} from '../app-models/param-bean';
import {BadgeComponent} from '../badge/badge.component';
import {ComponentInjector, SidebarService} from '../../lib/exportable/sidebar/controls/sidebar.service';
import {EmployeeService} from '../app-services/employee.service';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.css']
})
export class BadgesComponent implements OnInit, OnDestroy {
  panelHeader: string;

  subs: Subscription;
  lang: Subscription;

  labels: Students<MetadataResponse<Abstract<string>>, MetadataResponse<Abstract<string>>>;
  filters: {[key: string]: MetadataResponse<Abstract<string>>};
  order: FilterOrder = {
    firstName: {inputType: 'COMBO_BOX', value: 'STUD00000000002'},
    lastName: {},
    barcode: {},
    badgeCode: {}
  };
  studentsList: ListResponse<Students<string, number>>;

  params: ParamBean = {
    paramBean: {
      fillFieldLabels: true,
      pageSize: 6,
      pageNo: 1
    }
  };

  dataPool = [
    {id: 'STUD00000000001', someLabel: 'Hegi Gjoka', firstName: 'Hegi', lastName: 'Gjoka', email: 'h.gjoka@fzkm.org'},
    {id: 'STUD00000000002', someLabel: 'Monika Papa', firstName: 'Monika', lastName: 'Papa', email: 'm.papa@fzkm.org'},
    {id: 'STUD00000000003', someLabel: 'Bedri Allkja', firstName: 'Bedri', lastName: 'Allkja', email: 'b.allkja@fzkm.org'},
  ];

  constructor(
    private studentService: EmployeeService,
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initControl();
    this.subs = this.sidebarService.injectComponentToComponent.subscribe((res: ComponentInjector) => {
      if (res && !res.control) {
        this.initControl();
      }
    });
  }

  ngOnDestroy() {
    this.lang.unsubscribe();
    this.subs.unsubscribe();
  }

  initControl() {
    this._getStudentsMeta();
    if (this.route.snapshot.queryParams['studentId']) {
      this.openStudent(this.route.snapshot.queryParams['studentId']);
    }
  }

  private _getStudentsMeta() {
    this.studentService.getStudentsMeta().subscribe( (res: any) => {
      this.labels = res.fieldMap;
      this.filters = res.filterMap;
      this.panelHeader = res.label;
    });
  }

  private _getStudentsList() {
    this.studentService.getStudentList({params: this.params}).subscribe((res: any) => {
      this.studentsList = res;
    });
  }

  filtering(event) {
    Object.keys(this.order).forEach((key) => {
      if (this.params.paramBean[key]) { delete this.params.paramBean[key]; }
    }); Object.assign(this.params.paramBean, event);
    this._getStudentsList();
  }

  openStudent(studentId) {
    const params = {studentId: studentId};
    this.router.navigate([], {queryParams: {studentId: studentId}}).then(() => {
      this.sidebarService.setComponent(true, params, BadgeComponent, {
        studentId: studentId,
        labels: this.labels
      });
    });
  }
}
