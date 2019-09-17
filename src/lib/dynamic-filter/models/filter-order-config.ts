import {FormControlModel} from '../../models/form-control.model';
import {Methods} from '../../models/field-order.model';

export class FilterOrderConfig extends FormControlModel {
  selectLabel?: string | any;
  required?: boolean;
  disabled?: boolean;

  methods?: Methods;
  svc?: string;

  constructor() {
    super();
    this.disabled = false;
    this.svc = 'svc';
  }
}
