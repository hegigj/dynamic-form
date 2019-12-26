import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObjectType} from '../models/extra.model';

@Injectable()
export class ProviderService {
  constructor(private _httpClient: HttpClient) {}

  fieldRestPool(svc: string, url: string, key: string, value: any, params?: ObjectType): Observable<Object> {
    const options = {
      params: new HttpParams().set('paramBean', JSON.stringify(this._paramsConfig(key, value, params)))
    };
    // rest pool request
    return this._httpClient.get(`${svc}${url}`, options).pipe(map((res: any) => {
      if (res.status.code === 'STATUS_OK') {
        return res.body.data;
      } else {
        return throwError(`Request returned with status ${res.status.code}: \\src\\lib\\common\\controls\\provider.service.ts:17`);
      }
    }));
  }

  private _paramsConfig(key: string, value: any, params?: ObjectType): ObjectType {
    // noinspection TsLint
    if (params === undefined || params === {} || params.paramBean === {}) params = {paramBean: {pageNo: 1, pageSize: -1}};
    // noinspection TsLint
    if (key) Object.assign(params.paramBean, {[key]: value});
    // noinspection TsLint
    if (key && (value === undefined || value === null || value === '')) delete params.paramBean[key];
    return params.paramBean;
  }
}
