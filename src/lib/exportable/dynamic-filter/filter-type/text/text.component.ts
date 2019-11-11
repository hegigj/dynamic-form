import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FilterOrderConfig} from '../../models/filter-order-config';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() filter: FilterOrderConfig;

  constructor() { }

  ngOnInit() {
  }

  change() {
    if (this.filter.methods && this.filter.methods['change']) {
      this.filter.methods['change']();
    }
  }
}
