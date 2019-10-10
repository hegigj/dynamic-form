import {FilterOrderConfig} from '../../exportable/dynamic-filter/models/filter-order-config';
import {FormOrderConfig} from '../../exportable/dynamic-form/models/form-order-config';

export class FieldMapModel {
  [key: string]: FormOrderConfig | FilterOrderConfig;
}
