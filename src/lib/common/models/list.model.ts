import {AbstractModel} from './abstract.model';

export class ListModel<T = AbstractModel> {
  list: T[] | any;
  pageNo: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
