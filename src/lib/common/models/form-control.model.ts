import {ListModel} from './list.model';
import {FieldMapModel} from './fieldMap.model';

export class FormControlModel {
  fieldName?: string | any;
  fieldLabel?: string;
  inputType?: string;
  canGet?: boolean;
  canPost?: boolean;
  canPut?: boolean;
  constraintList?: Constraint;
  childFieldMeta?: FieldMapModel | {};
  fieldDataPool?: ListModel;
  fieldRestPool?: string;
  fieldRestVal?: string;
  fieldDependsOn?: string[];
}

export class ObjectType {
  [key: string]: any;
}

export class Constraint {
  [key: string]: Size | Min | Max | NotNull | Pattern | any;
}

export class Methods {
  [command: string]: Function;
}

export class Buttons {
  icon?: string;
  color?: 'primary' | 'accent' | 'warn';
  label?: string;
  toolTip?: string;
  method: Function;
  useValue: string;
}

export class Suffix {
  type: 'icon' | 'text';
  text: string;
}

class Size {
  min?: number;
  max: number;
  message: string;
}

class Min {
  min: number;
  message: string;
}

class Max {
  max: number;
  message: string;
}

class Pattern {
  regexp: string;
  message: string;
}

class NotNull {
  message: string;
}

export declare type BootstrapClass = 'col-12' | 'col-9' | 'col-6' | 'col-4' | 'col-3';
