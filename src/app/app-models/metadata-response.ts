import {ListResponse} from './list-response';

export class MetadataResponse<T> {
  fieldName: string;
  fieldLabel: string;
  inputType: string;
  canGet: boolean;
  canPost: boolean;
  canPut: boolean;
  constraintList: {};
  fieldDataPool: ListResponse<T>;
  fieldRestPool: string;
  fieldRestVal: string;
}
