import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FilterOrderConfig} from '../../models/filter-order-config';

@Component({
  selector: 'app-decimal',
  templateUrl: './decimal.component.html',
  styleUrls: ['./decimal.component.css']
})
export class DecimalComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() filter: FilterOrderConfig;

  constructor() { }

  ngOnInit() {
  }
}
