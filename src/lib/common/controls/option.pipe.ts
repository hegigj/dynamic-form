import {Pipe, PipeTransform} from '@angular/core';
import {ObjectType} from '../models/extra.model';

@Pipe({
  name: 'option'
})
export class OptionPipe implements PipeTransform {
  transform(value: ObjectType | any, selectLabel?: string) {
    switch (typeof value) {
      case 'object': {
        if (selectLabel && selectLabel.match(/\s/g)) { // if selectLabel has SPACE
          let labels = '';
          selectLabel.split(' ').forEach(label => {
            // noinspection TsLint
            if (value[label]) labels += value[label];
            labels += ' ';
          });
          return labels.substr(0, labels.length - 1); // if: selectLabel: 'firstName lastName'; return 'John Doe';
        } else if (selectLabel && selectLabel.match(/\./g)) { // if selectLabel has DOT NOTATION
          const labels: string[] = [];
          selectLabel.split('.').forEach(label => labels.push(label));
          // noinspection TsLint
          switch (labels.length) {
            case 2:
              return value[labels[0]][labels[1]]; // if: selectLabel: 'labelMap.label'; return value['labelMap']['label'];
            case 3:
              return value[labels[0]][labels[1]][labels[2]]; // if: selectLabel: 'labelMap.label.label1'; return value['labelMap']['label']['label1'];
            case 4:
              return value[labels[0]][labels[1]][labels[2]][labels[3]]; // if: selectLabel: 'labelMap.label.label1.label2'; return value['labelMap']['label']['label1']['label2'];
            case 5:
              return value[labels[0]][labels[1]][labels[2]][labels[3]][labels[4]]; // if: selectLabel: 'labelMap.label.label1.label2.label3'; return value['labelMap']['label']['label1']['label2']['label3'];
            case 6:
              return value[labels[0]][labels[1]][labels[2]][labels[3]][labels[4]][labels[5]]; // if: selectLabel: 'labelMap.label.label1.label2.label3.label4'; return value['labelMap']['label']['label1']['label2']['label3']['label4'];
            default:
              return value['someLabel'];
          }
        } else if (selectLabel) {
          return value[selectLabel];
        } else {
          return value['someLabel'];
        }
      }
      default:
        return value;
    }
  }
}
