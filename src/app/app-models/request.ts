import {Abstract} from './abstract';

export class Request<T> extends Abstract<T> {
  employeeId: T;
  authorizationDate: T;
  authorizationTypeId: T;
  authorizationId: T;
  approvementId: T;
  validationDate: T;
  insertDate: T;
  requestTypeId: T;
  substitutionDates: T;
  missionTypeId: T;
  expireDate: T;
  countHD: T;
  empIds: T;
  holidayTypeId: T;
  directorNotes: T;
  directorId: T;
  processedId: T;
  badgeFailTypeId: T;
  managerNotes: T;
  managerId: T;
  missionWhere: T;
  approvementDate: T;
  insertOperator: T;
  pendingActionFrom: T;
  status: T;
  labelMap: {
    pendingActionFrom?: string;
    requestTypeId: string;
    employeeId: string;
    managerId?: string;
    directorId?: string;
    officeNameId: string;
    approvementId?: string;
    authorizationId?: string;
    processedId?: string;
    status: string;
  };

  constructor() {
    super();
  }
}
