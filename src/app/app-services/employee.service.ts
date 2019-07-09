import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class EmployeeService {
  private url = 'svc/hr/employee';

  constructor(private _httpClient: HttpClient) { }

  getEmployeeMeta() {
    return this._httpClient.options(this.url);
  }

  getEmployee(employeeId: string, params?) {
    const reqOptions = {
      params: new HttpParams().set('paramBean', JSON.stringify(params ? params.params.paramBean : {}))
    };
    return this._httpClient.get(this.url + '/' + employeeId, reqOptions);
  }

  getEmployeeList(params?) {
    const reqOptions = {
      params: new HttpParams().set('paramBean', JSON.stringify(params ? params.params.paramBean : {}))
    };
    return this._httpClient.get(this.url, reqOptions);
  }

  getExtraHourRequestMeta() {
    return this._httpClient.options(`${this.url}/EMPL00000000115/requests/type/substitutions`);
  }

  getExtraHourRequest(userId, requestId, params?) {
    const reqOptions = {
      params: new HttpParams().set('paramBean', JSON.stringify(params ? params.params.paramBean : {}))
    };
    return this._httpClient.get(`${this.url}/${userId}/requests/type/substitutions/${requestId}`, reqOptions);
  }
}
