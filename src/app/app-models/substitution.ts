import {Abstract} from './abstract';
import {MetadataResponse} from './metadata-response';

export class Substitution<T> extends Abstract<T> {
  insertDate: T;
  requestTypeId: T;
  startTimestamp: T;
  stopTimestamp: T;
  employeeId: T;
  officeNameId: T;
  employeeNotes: T;
  authorizationId: T;
  processedId: T;
  hrOfficeNotes: T;
  status?: T;
  directorNotes: T;
  authorizationDate: T;
  directorId: T;
  approvementId: T;
  managerNotes: T;
  managerId: T;
  substitutionDates: T[];
  approvementDate: T;
  insertOperator: T;
  countHD: number | MetadataResponse<Abstract<string>>;
  holidayTypeId: T;
  labelMap: {
    requestTypeId: T;
    employeeId: T;
    managerId: T;
    directorId: T;
    officeNameId: T;
    approvementId: T;
    authorizationId: T;
    holidayTypeId: T;
  };
}
