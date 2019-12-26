export class ParamBeanModel {
  paramBean: {
    fillFieldLabels?: boolean;
    pageNo?: number;
    pageSize?: number;
    [param: string]: string | number | boolean | any;
  };
}
