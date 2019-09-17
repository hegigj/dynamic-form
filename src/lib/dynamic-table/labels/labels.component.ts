import {Component, Input, OnInit} from '@angular/core';
import {FormControlModel} from '../../models/form-control.model';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
  @Input() labels: FormControlModel[];

  constructor() { }

  ngOnInit() {
  }

}
