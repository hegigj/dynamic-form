import {Component, Input, OnInit} from '@angular/core';
import {FormControlModel} from '../../models/form-control.model';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {
  @Input() notId: boolean;
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormControlModel;
  @Input() fg: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
