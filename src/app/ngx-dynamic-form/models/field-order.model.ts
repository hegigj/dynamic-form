export class FieldOrderModel {
  [key: string]: OrderConfigs
}

export class OrderConfigs {
  class?: BootstrapClass;

  value?: string | any;
  selectValue?: string | any;

  multi?: boolean;
  display?: boolean;

  disableDatePicker?: boolean;
  disableTimePicker?: boolean;
  disableDateInputArea?: boolean;
  disableRemoveDateInputArea?: boolean;

  disabled?: boolean;
  required?: boolean;

  methods?: Methods;
}

export class Methods {
  [command: string]: Function;
}

export declare type BootstrapClass = 'col-12' | 'col-6' | 'col-3';
