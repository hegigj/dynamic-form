import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class SharedService {
  constructor(private _httpClient: HttpClient) {}

  fieldRestPool(svc: string, url: string, key?, value?): Observable<Object> {
    const params = {
      fillFieldLabels: true,
      pageNo: 1,
      pageSize: -1
    };
    if (key) {
      Object.assign(params, {[key]: value});
    }
    if (key && value === undefined) {
      delete params[key];
    }
    const options = {
      params: new HttpParams().set('paramBean', JSON.stringify(params))
    };
    // rest pool request
    return this._httpClient.get(`${svc}${url}`, options);
  }

  selectLabel(option, selectLabel?): any {
    if (selectLabel) {
      if (selectLabel.match(/[a-zA-z_]+\s[a-zA-z_]+/g)) {
        return `${option[selectLabel.split(' ')[0]]} ${option[selectLabel.split(' ')[1]]}`;
      } else if (selectLabel.match(/\./g)) {
        return option[selectLabel.split('.')[0]][selectLabel.split('.')[1]];
      } else {
        return option[selectLabel];
      }
    }
    return option['someLabel'];
  }
}
