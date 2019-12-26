import {FormControlModel} from '../../../common/models/form-control.model';
import {BootstrapClass, Buttons, Methods, ObjectType, Suffix} from '../../../common/models/extra.model';

export class FormOrderConfig extends FormControlModel {
  class?: BootstrapClass | BootstrapClass[];
  onTextInputTextarea?: boolean;
  childField?: ChildFormOrder;
  formArrayActions?: FormArrayActions;

  customValidators?: any[];
  errorMessages?: ObjectType;

  value?: string | any;
  selectValue?: string | any;
  selectLabel?: string | any;
  autocompleteLabel?: string | any;

  dateFormat?: string;
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
  suffix?: Suffix;

  methods?: Methods;
  svc?: string;

  constructor() {
    super();
    this.display = true;

    this.dateFormat = 'MMM dd yyyy, HH:mm';
    this.displayDatePicker = true;
    this.displayTimePicker = true;

    this.displayDateInputArea = true;
    this.displayRemoveDateInputArea = true;

    this.svc = 'svc';
  }
}

class ChildFormOrder {
  [key: string]: FormOrderConfig;
}

class FormArrayActions {
  buttons?: Buttons;
  addButtonLabel?: string;
  disableAddButton?: boolean;
  deleteButtonLabel?: string;
  disableDeleteButton?: boolean;
  resetButtonLabel?: string;
}
