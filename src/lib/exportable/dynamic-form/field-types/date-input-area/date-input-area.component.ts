import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AmazingTimePickerService} from 'amazing-time-picker-angular6';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {FormOrderConfig} from '../../models/form-order-config';
import {Subscription} from 'rxjs';
import {TimezonePipe} from '../../../../common/controls/timezone.pipe';

@Component({
  selector: 'app-date-input-area',
  templateUrl: './date-input-area.component.html',
  styleUrls: ['./date-input-area.component.css']
})
export class DateInputAreaComponent implements OnInit, OnDestroy {
  @Input() display: boolean;
  @Input() appearance: string;
  @Input() field: FormOrderConfig;
  @Input() fg: FormGroup;

  i: number;
  index: number;

  valueChanges: Subscription;
  errorMessages: string[] = [];
  constructor(private _atp: AmazingTimePickerService) { }

  ngOnInit() {
    this.index = this.fg.controls[this.field.fieldName].value.length - 1;
    this.i = this.index;
    this.checkFormArray();
    this._checkForErrors();
  }

  ngOnDestroy() {
    this.valueChanges.unsubscribe();
  }

  openDP(dp, index) {
    this.i = index;
    dp.open();
  }

  addDate(e) {
    const date = new TimezonePipe().transform(e.value);
    this._setTimestamp(date.split('T')[0]);
  }

  addTime(index) {
    this.i = index;
    this._atp.open({theme: 'light'}).afterClose().subscribe((time: any) => {
      this._setTimestamp(null, `${time}:00`);
    });
  }

  private _setTimestamp(date?, time?) {
    const formArrayControl = (<FormArray>this.fg.controls[this.field.fieldName]).at(this.index !== this.i ? this.i : this.index);
    if (date && time) {
      formArrayControl.setValue(`${date}T${time}`);
    } else if (date) {
      if (formArrayControl.value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g)) {
        time = formArrayControl.value.split('T')[1];
        formArrayControl.setValue(`${date}T${time}`);
      } else {
        formArrayControl.setValue(`${date}T00:00:00`);
      }
    } else if (time) {
      if (formArrayControl.value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g)) {
        date = formArrayControl.value.split('T')[0];
        formArrayControl.setValue(`${date}T${time}`);
      } else {
        formArrayControl.setValue(`${new Date().toISOString().split('T')[0]}T${time}`);
      }
    } else {
      formArrayControl.setValue('');
    }
  }

  checkFormArray() {
    if (this.index >= 0) {
      const formArrayControl = (<FormArray>this.fg.controls[this.field.fieldName]).at(this.index);
      return formArrayControl.value === '';
    } else if (this.index < 0) {
      return false;
    }
  }

  addNew() {
    this.index ++;
    const formArrayControl = this.fg.controls[this.field.fieldName] as FormArray;
    const formArrayValidators = formArrayControl.at(this.index - 1).validator;
    formArrayControl.push(new FormControl({value: '', disabled: this.field.disabled}, formArrayValidators));
  }

  removeNew(index) {
    const formArrayControl = this.fg.controls[this.field.fieldName] as FormArray;
    formArrayControl.removeAt(index);
    this.index --;
  }

  private _checkForErrors() {
    const formArrayControl = (<FormArray>this.fg.controls[this.field.fieldName]).at(this.index !== this.i ? this.i : this.index);
    this.valueChanges = formArrayControl.valueChanges.subscribe(() => {
      if (this.field.errorMessages) {
        if (formArrayControl.errors) {
          Object.keys(formArrayControl.errors).forEach((key) => {
            if (this.errorMessages.indexOf(this.field.errorMessages[key]) === -1) {
              this.errorMessages.push(this.field.errorMessages[key]);
            }
          });
        } else {
          this.errorMessages = [];
        }
      }
    });
  }
}
