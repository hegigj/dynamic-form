export class FieldOrderModel {
  [key: string]: OrderConfigs
}

export class OrderConfigs {
  class?: BootstrapClass;

  value?: string | any;
  metaValue?: string | any;
  selectValue?: string | any;
  selectLabel?: string | any;

  disableDatePicker?: boolean;
  displayDatePicker?: boolean;

  disableTimePicker?: boolean;
  displayTimePicker?: boolean;

  disableDateInputArea?: boolean;
  displayDateInputArea?: boolean;

  disableRemoveDateInputArea?: boolean;
  displayRemoveDateInputArea?: boolean;

  multi?: boolean;
  display?: boolean;
  disabled?: boolean;
  required?: boolean;
  canReset?: boolean;

  methods?: Methods;
  svc?: string;
}

export class Methods {
  [command: string]: Function;
}

export declare type BootstrapClass = 'col-12' | 'col-9' | 'col-6' | 'col-3';
