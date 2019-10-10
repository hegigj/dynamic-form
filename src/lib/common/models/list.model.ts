import {AbstractModel} from './abstract.model';

export class ListModel {
  list: AbstractModel[] | any;
  pageNo: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
