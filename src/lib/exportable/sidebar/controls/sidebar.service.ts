import {Injectable, Type} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {ObjectType} from '../../../common/models/extra.model';

export interface ComponentInjector {
  control?: boolean;
  params?: ObjectType;
  component?: Type<any>;
  configs?: ObjectType;
}

@Injectable()
export class SidebarService {
  private _params: ComponentInjector;
  private _injectComponentToComponent = new BehaviorSubject(this._params);

  constructor(private _router: Router) {}

  setComponent(control?: boolean, params: ObjectType = null, component?: Type<any>, configs?: ObjectType) {
    this._navigate(params);
    if (control !== undefined) {
      this._params = {control: control, component: component, configs: configs};
      Object.keys(this._params).forEach(key => {if (this._params[key] === undefined) { delete this._params[key]; }});
      this._injectComponentToComponent.next(this._params);
    } else {
      this._params = null;
      this._injectComponentToComponent.next(this._params);
    }
  }

  get injectComponentToComponent(): Observable<ComponentInjector> {
    return this._injectComponentToComponent.asObservable();
  }

  private _navigate(params?: ObjectType) {
    if (params) {
      this._router.navigate([], {queryParams: params}).then();
    }
  }
}
