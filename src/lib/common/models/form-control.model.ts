import {ListModel} from './list.model';
import {FieldMapModel} from './fieldMap.model';
import {Constraint} from './extra.model';

export class FormControlModel {
  fieldName?: string;
  fieldLabel?: string;
  inputType?: string;
  canGet?: boolean;
  canPost?: boolean;
  canPut?: boolean;
  constraintList?: Constraint;
  childFieldMeta?: FieldMapModel | any | {};
  fieldDataPool?: ListModel;
  fieldRestPool?: string;
  fieldRestVal?: string;
  fieldDependsOn?: string[];
}
