import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErrorCheck} from '../../controls/error-check';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent extends ErrorCheck implements OnInit, OnDestroy {
  errorMessages: string;
  constructor() {
    super();
  }

  ngOnInit() {
    this.errorMessage.subscribe(em => this.errorMessages = em);
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
