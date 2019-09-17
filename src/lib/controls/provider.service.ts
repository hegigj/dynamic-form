import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ProviderService {
  constructor(private _httpClient: HttpClient) {}

  fieldRestPool(svc: string, url: string, key, value?, params?): Observable<Object> {
    const options = {
      params: new HttpParams().set('paramBean', JSON.stringify(this._paramsConfig(key, value, params)))
    };
    // rest pool request
    return this._httpClient.get(`${svc}${url}`, options).pipe(map((res: any) => {
      if (res.status.code === 'STATUS_OK') {
        return res.body.data;
      } else {
        return throwError(`Request returned with ${res.status.code}, so is backend fault!`);
      }
    }));
  }

  private _paramsConfig(key, value?, params?) {
    if (params === undefined || params.paramBean === {}) {
      params = {paramBean: {pageNo: 1, pageSize: -1}};
    }
    if (key) {
      Object.assign(params.paramBean, {[key]: value});
    }
    if (key && (value === undefined || value === null || value === '')) {
      delete params.paramBean[key];
    } return params.paramBean;
  }
}
