import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class EmployeeService {
  private url = 'svc/hr/employee';

  constructor(private _httpClient: HttpClient) { }

  getEmployeeList(params?) {
    const reqOptions = {
      params: new HttpParams().set('paramBean', JSON.stringify(params ? params.params.paramBean : {}))
    };
    return this._httpClient.get(this.url, reqOptions);
  }

  getRequestMeta() {
    return this._httpClient.options(`${this.url}/EMPL00000000140/requests`);
  }

  getSubstitutionMeta() {
    return this._httpClient.options(`${this.url}/EMPL00000000140/requests/type/substitutions`)
  }

  getSubstitution(id, params?) {
    const reqOptions = {
      params: new HttpParams().set('paramBean', JSON.stringify(params ? params.params.paramBean : {}))
    };
    return this._httpClient.get(`${this.url}/EMPL00000000140/requests/type/substitutions/${id}`, reqOptions);
  }

  getRequestList(params?) {
    const reqOptions = {
      params: new HttpParams().set('paramBean', JSON.stringify(params ? params.params.paramBean : {}))
    };
    return this._httpClient.get(`${this.url}/EMPL00000000140/requests`, reqOptions);
  }
}
