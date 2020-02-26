import {FormOrderConfig} from '../../exportable/dynamic-form/models/form-order-config';

export class ObjectType {
  [key: string]: any;
}

export class Constraint {
  [key: string]: Size | Min | Max | NotNull | Pattern | Past | any;
}

export class Methods {
  [command: string]: Function;
}

export class Buttons {
  icon?: string;
  color?: Color;
  label?: string;
  method: Function;
}

export class Suffix {
  type: SuffixType;
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

class Past {
  message: string;
}

export class ChildFormOrder {
  [key: string]: FormOrderConfig;
}

export class FormArrayActions {
  buttons?: Buttons;
  addButtonLabel?: string;
  disableAddButton?: boolean;
  deleteButtonLabel?: string;
  disableDeleteButton?: boolean;
  resetButtonLabel?: string;
}

// noinspection TsLint
export declare type BootstrapClass = 'col-12' | 'col-9' | 'col-6' | 'col-4' | 'col-3' | 'col-sm-12' | 'col-sm-9' | 'col-sm-6' | 'col-sm-4' | 'col-sm-3';

declare type Color = 'primary' | 'accent' | 'warn';

declare type SuffixType = 'icon' | 'text';
