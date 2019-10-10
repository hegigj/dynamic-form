import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSidenav} from '@angular/material';
import {InjectComponentDirective} from '../../lib/exportable/sidebar/controls/inject-component.directive';
import {SidebarService} from '../../lib/exportable/sidebar/controls/sidebar.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('menu') menu: MatSidenav;
  @ViewChild('drawer') drawer: MatSidenav;
  @ViewChild(InjectComponentDirective) private _insertionPoint: InjectComponentDirective;

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  private _componentRef: ComponentRef<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sidebarService: SidebarService,
    private detectorRef: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.sidebarService.injectComponentToComponent.subscribe((res: any) => {
      if (res) {
        res.control ?
          this.drawer.open().then(() => this._loadChildComponent(res.component, res.configs)) :
          this.drawer.close().then(() => this._destroyChildComponent());
      }
    });
  }

  private _destroyChildComponent() {
    if (this._componentRef) { this._componentRef.destroy(); }
  }

  private _loadChildComponent(componentType: Type<any>, config?) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    const viewContainerRef = this._insertionPoint.viewContainerRef;
    viewContainerRef.clear();
    this._componentRef = viewContainerRef.createComponent(componentFactory);

    if (config) {
      Object.keys(config).forEach((key) => {
        this._componentRef.instance[key] = config[key];
      });
    }
  }

  backing() {
    this.router.navigate([], {relativeTo: this.route}).then(() => {
      this.sidebarService.setComponent(false);
    });
  }
}
