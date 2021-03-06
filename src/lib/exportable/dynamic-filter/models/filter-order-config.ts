import {FormControlModel} from '../../../common/models/form-control.model';
import {Methods} from '../../../common/models/extra.model';

export class FilterOrderConfig extends FormControlModel {
  value?: string | any;

  selectValue?: string | any;
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
