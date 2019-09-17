import {BootstrapClass, Methods} from '../../models/field-order.model';
import {FormControlModel} from '../../models/form-control.model';

export class FormOrderConfig extends FormControlModel {
  class?: BootstrapClass;

  value?: string | any;
  selectValue?: string | any;
  selectLabel?: string | any;
  autocompleteLabel?: string | any;

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
