export class OrderConfigs {
  xClass?: string;

  label?: boolean;
  labelClass?: LabelClass;
  labelSeparator?: string;

  isDate?: boolean;
  dateFormat?: string;

  verticalLabels?: boolean;
  horizontalLabels?: boolean;
  primaryLabels?: string;
  secondaryLabels?: string;

  avatar?: boolean;
  fgColor?: string;
  bgColor?: string;
  avatarName?: string;
  avatarSrc?: string;
  avatarSize?: number;

  replaceNullValue?: string;

  methods?: Methods;
  svc?: string;

  constructor() {
    this.avatar = false;
    this.fgColor = '#1a2a31';
    this.bgColor = '#ffffff';
    this.avatarSize = 40;

    this.label = false;

    this.isDate = false;
    this.dateFormat = 'MMM dd, yyyy';

    this.verticalLabels = false;
    this.horizontalLabels = false;
  }
}

export class Buttons {
  icon?: string;
  color?: MaterialButton;
  label?: string;
  toolTip?: string;
  method: Function;
  useValue: string;
}

export class Methods {
  [command: string]: Function;
}

export class LabelClass {
  [ngClass: string]: any;
}

export declare type BootstrapClass = 'col-12' | 'col-9' | 'col-6' | 'col-4' | 'col-3';
export declare type MaterialButton = 'primary' | 'accent' | 'warn';
