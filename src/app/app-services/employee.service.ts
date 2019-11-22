import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable()
export class EmployeeService {
  // private url = 'svc/hr/employee';
  private url = 'svc/badge/student';

  constructor(private _httpClient: HttpClient) { }

  getRequestMeta() {
    return this._httpClient.options(`${this.url}/EMPL00000000140/requests`);
  }

  getRequestList(params?) {
    const reqOptions = {
      params: new HttpParams().set('paramBean', JSON.stringify(params ? params.params.paramBean : {}))
    };
    return this._httpClient.get(`${this.url}/EMPL00000000140/requests`, reqOptions);
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

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getStudentsMeta() {
    return this._httpClient.options(`${this.url}`).pipe(map((res: any) => {
      if (res.status.code === 'STATUS_OK') {
        return res.body.data;
      }
    }));
  }

  getStudentList(params?) {
    const reqOptions = {
      params: new HttpParams().set('paramBean', JSON.stringify(params ? params.params.paramBean : {}))
    };
    return this._httpClient.get(`${this.url}`, reqOptions).pipe(map((res: any) => {
      if (res.status.code === 'STATUS_OK') {
        return res.body.data;
      }
    }));
  }

  getStudent(studentId) {
    const reqOptions = {params: new HttpParams().set('paramBean', '{"fillFieldLabels":true}')};
    return this._httpClient.get(`${this.url}/${studentId}`, reqOptions).pipe(map((res: any) => {
      if (res.status.code === 'STATUS_OK') {
        return res.body.data;
      }
    }));
  }

  getBadgesMeta(studentId) {
    return this._httpClient.options(`${this.url}/${studentId}/badge`);
  }

  getBadgesList(studentId, params?) {
    const reqOptions = {
      params: new HttpParams().set('paramBean', JSON.stringify(params ? params.params.paramBean : {}))
    };
    return this._httpClient.get(`${this.url}/${studentId}/badge`, reqOptions);
  }

  addBadge(studentId, body?) {
    const reqOptions = {
      params: new HttpParams().set('paramBean', '{"fillFieldLabels":true}')
    };
    return this._httpClient.post(`${this.url}/${studentId}/badge/new`, body, reqOptions);
  }

  editBadge(studentId, badgeId, body?) {
    return this._httpClient.put(`${this.url}/${studentId}/badge/${badgeId}`, body);
  }

  downloadBadge(studentId, badgeId) {
    return this._httpClient.get(`${this.url}/${studentId}/badge/${badgeId}/download`, {responseType: 'blob'});
  }
}
