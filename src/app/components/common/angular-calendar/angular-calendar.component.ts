import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, SimpleChanges,
         OnChanges, Output, EventEmitter } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import * as moment from 'moment';

@Component({
  selector: 'app-angular-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './angular-calendar.component.html',
  styleUrls: ['./angular-calendar.component.scss'],
})
export class AngularCalendarComponent implements OnInit, OnChanges {

  @Input() title = '';
  @Input() eventsCalendar: CalendarEvent[] = [];
  // Exclude weekends [0, 6]
  @Input() excludeDays: number[] = [];
  @Input() customCellTemplate = '';
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen = false;

  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    if (changes['eventsCalendar'].currentValue) {
        this.eventsCalendar = changes['eventsCalendar'].currentValue;
        console.log('eventsCalendar', this.eventsCalendar);
        // this.cd.detectChanges();
    }
}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('AngularCalendarComponent::dayClicked() | method called');

    if (moment(date).isSame(this.viewDate, 'month')) {
      this.viewDate = date;
      if (
        (moment(date).isSame(this.viewDate, 'day') && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
    this.cd.detectChanges();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log('AngularCalendarComponent::handleEvent() | method called');
    this.event.emit(event);
  }

}
