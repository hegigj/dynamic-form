import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormOrderConfig} from '../../models/form-order-config';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.css']
})
export class CheckBoxComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() field: FormOrderConfig;
  @Input() display: boolean;

  constructor() { }

  ngOnInit() {
  }

}
