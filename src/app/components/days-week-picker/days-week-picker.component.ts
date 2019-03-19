import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-days-week-picker',
  templateUrl: './days-week-picker.component.html',
  styleUrls: ['./days-week-picker.component.scss'],
})
export class DaysWeekPickerComponent implements OnInit {

  weekdays = moment.weekdays();
  @Output() event: EventEmitter<Object> = new EventEmitter<Object>();
  selectedWeekdays = {
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  };

  constructor() { }

  ngOnInit() {
  }

  selectedDay(weekday) {
    this.selectedWeekdays[weekday] = !this.selectedWeekdays[weekday];
    this.event.emit(this.selectedWeekdays);
  }

}
