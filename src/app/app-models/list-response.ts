export class ListResponse<T> {
  list: T[];
  pageNo: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
