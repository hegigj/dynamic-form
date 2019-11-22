import {Abstract} from './abstract';

export class Badges<T> extends Abstract<T> {
  badgeCode: T;
  issueDate: T;
  insertOperator: T;
  lastUpdate: T;
  badgeStatus: T;
  notes: T;
  personId: T;
  studentRegistrationId: T;
  labelMap: {
    personId: T;
    studentRegistrationId: T;
    insertOperator: T;
    badgeStatus: T;
  };
}
