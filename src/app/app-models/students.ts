import {Abstract} from './abstract';

export class Students<T, R> extends Abstract<T> {
  // student in Student Badges
  personId: T;
  studentUsn: T;
  studentLegalUsn: T;
  firstName: T;
  lastName: T;
  birthDate: T;
  facultyId: T;
  facultyName: T;
  graduateCourseId: T;
  graduateCourseName: T;
  registrationDate: T;
  firstAccYear: T;
  yearNo: R;
  studPosition: T;
  studStatus: T;
  badgeCode: T;
  badgeStutus: T;
  labelMap: {};

  // student in Student Attendance
  studentCurrentYear: R;
  didactiCourseId: T;
  dcName: T;
  typeId: T;
  creditsCfuTotal: R;
  dcYear: R;
  dcSemester: R;
  dcCategory: T;
  attendanceObligatory: boolean;
  examPlanned: boolean;
  studentGroups: string[];
  attendedHours: R;
  studRegPlanId: T;
  activeCareerId: T;
  equivalentDcIds: boolean;
  dcFreqConcluded:  boolean;
  fulfillment: boolean;
}
