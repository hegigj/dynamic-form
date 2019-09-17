import {ListModel} from './list.model';

export class FormControlModel {
  fieldName?: string | any;
  fieldLabel?: string;
  inputType?: string;
  canGet?: boolean;
  canPost?: boolean;
  canPut?: boolean;
  constraintList?: ObjectType;
  fieldDataPool?: ListModel;
  fieldRestPool?: string;
  fieldRestVal?: string;
  fieldDependsOn?: string[];
}

export class ObjectType {
  [key: string]: any;
}
