import {Injectable, Type} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface ComponentInjector {
  control?: boolean;
  component?: Type<any>;
  configs?: {[key: string]: any};
  timestamp?: number;
}

@Injectable()
export class SidebarService {
  private _params: ComponentInjector;
  private _injectComponentToComponent = new BehaviorSubject(this._params);

  constructor() {}

  setComponent(control?: boolean, params?: {[key: string]: any}, component?: Type<any>, configs?: {[key: string]: any}) {
    this._navigate(params);
    if (control !== undefined) {
      this._params = {control: control, component: component, configs: configs, timestamp: new Date().valueOf()};
      Object.keys(this._params).forEach(key => {if (this._params[key] === undefined) { delete this._params[key]; }});
      this._injectComponentToComponent.next(this._params);
    } else {
      this._params = null;
      this._injectComponentToComponent.next(this._params);
    }
  }

  private _navigate(params) { let query = '?';
    Object.keys(params ? params : {}).forEach(key => query += `${key}=${params[key]}&`);
    const url = params ? window.location.href + query.substr(0, query.length - 1) : window.location.href.split('?')[0];
    window.history.replaceState(params, null, url);
  }

  get injectComponentToComponent() {
    return this._injectComponentToComponent; // call the observable
  }
}
