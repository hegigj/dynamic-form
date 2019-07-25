import {AbstractModel} from './abstract.model';
import {OrderConfigs} from './field-order.model';

export class FormControlModel extends OrderConfigs {
  fieldName: string | any;
  fieldLabel: string;
  inputType: string;
  canGet: boolean;
  canPost: boolean;
  canPut: boolean;
  constraintList: ObjectType;
  fieldDataPool: {
    list: AbstractModel[];
    pageNo: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  };
  fieldRestPool?: string;
  fieldRestVal?: string;
}

export class ObjectType {
  [key: string]: any;
}
