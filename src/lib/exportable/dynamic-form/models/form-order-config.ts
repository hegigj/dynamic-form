import {FormControlModel} from '../../../common/models/form-control.model';
import {TimePickerConfig} from 'amazing-time-picker-angular6/src/app/atp-library/definitions';
import {BootstrapClass, ChildFormOrder, FormArrayActions, Methods, ObjectType, Suffix} from '../../../common/models/extra.model';

export class FormOrderConfig extends FormControlModel {
  class?: BootstrapClass | BootstrapClass[];
  onTextInputTextarea?: boolean;

  childField?: ChildFormOrder;
  formArrayActions?: FormArrayActions;

  required?: boolean;
  customValidators?: any[];
  errorMessages?: ObjectType;

  value?: string | number | boolean | ObjectType | any;
  selectValue?: string;
  selectLabel?: string;
  autocompleteLabel?: string;

  dateFormat?: string;
  disableDatePicker?: boolean;
  displayDatePicker?: boolean;

  timePickerFormat?: TimePickerConfig;
  disableTimePicker?: boolean;
  displayTimePicker?: boolean;

  dateInputAreaLabel?: string;
  displayDateInputArea?: boolean;

  disableRemoveDateInputArea?: boolean;
  displayRemoveDateInputArea?: boolean;

  display?: boolean;
  disabled?: boolean;
  canReset?: boolean;
  suffix?: Suffix;

  multi?: boolean;
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
