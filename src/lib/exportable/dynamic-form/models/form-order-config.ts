import {BootstrapClass, Methods} from '../../../common/models/field-order.model';
import {FormControlModel, ObjectType} from '../../../common/models/form-control.model';

export class FormOrderConfig extends FormControlModel {
  class?: BootstrapClass;

  customValidators?: any[];
  errorMessages?: ObjectType;

  value?: string | any;
  selectValue?: string | any;
  selectLabel?: string | any;
  autocompleteLabel?: string | any;
  suffix?: {type: 'icon' | 'text', text: string} | null | undefined;

  disableDatePicker?: boolean;
  displayDatePicker?: boolean;

  disableTimePicker?: boolean;
  displayTimePicker?: boolean;

  dateInputAreaLabel?: string;
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

  constructor() {
    super();
    this.display = true;
    this.displayDatePicker = true;
    this.displayTimePicker = true;
    this.displayDateInputArea = true;
    this.displayRemoveDateInputArea = true;
    this.disabled = false;
    this.multi = false;
    this.svc = 'svc';
  }
}
