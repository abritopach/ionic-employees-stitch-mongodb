import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CalendarEvent, DAYS_OF_WEEK, CalendarView } from 'angular-calendar';
import { ModalController } from '@ionic/angular';

import { StitchMongoService } from '../../services/stitch-mongo.service';
import config from '../../config/config';
import { Holiday } from '../../models/holiday.model';

import * as moment from 'moment';
import { Subject } from 'rxjs';

// weekStartsOn option is ignored when using moment, as it needs to be configured globally for the moment locale
moment.updateLocale('en', {
  week: {
    dow: DAYS_OF_WEEK.MONDAY,
    doy: 0
  }
});


@Component({
  selector: 'app-upcoming-absences-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './upcoming-absences-modal.component.html',
  styleUrls: ['./upcoming-absences-modal.component.scss'],
})
export class UpcomingAbsencesModalComponent implements OnInit {

  view = 'month';

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];
  nextAbsences: any[] = [];

  // exclude weekends
  excludeDays: number[] = [0, 6];

  holidays: Holiday = null;
  activeDayIsOpen = false;

  CalendarView = CalendarView;

  refresh: Subject<any> = new Subject();

  constructor(private modalCtrl: ModalController, private stitchMongoService: StitchMongoService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.fetchEmployees();
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  fetchEmployees() {
    this.stitchMongoService.find(config.COLLECTION_KEY, {})
    .then(docs => {
      console.log(docs);
      if (docs.length !== 0) {
        docs.map(doc => {
          if ((typeof doc['holidays'] !== 'undefined')) {
            this.formatEventsCalendar(doc);
          }
        });
      }
    });
  }

  formatEventsCalendar(doc) {
    console.log('doc', doc);
    this.events = [];
    doc.holidays.taken.info.map(holiday => {
      if ((holiday.status !== 'pending') && (holiday.status !== 'rejected')) {
        console.log(holiday);
        const formattedEvent = {
          start: new Date(holiday.startDate),
          end: new Date(holiday.endDate),
          title: holiday.type + ' - ' + holiday.reason,
          meta: {avatar: doc.avatar, status: holiday.status}
        };
        console.log(formattedEvent);
        this.events = [
          ...this.events, formattedEvent];
        // this.events.push(formattedEvent);
      }
    });
    console.log('events', this.events);
    this.nextAbsences = this.events.filter(event => moment(event.start).isSameOrAfter(moment(), 'day'));
    console.log('nextAbsences', this.nextAbsences);
    this.cd.detectChanges();
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('UpcomingAbsencesModalComponent::dayClicked() | method called', date, events);
    if (moment(date).isSame(moment(this.viewDate), 'month')) {
      this.viewDate = date;
      if ((moment(date).isSame(moment(this.viewDate), 'day') && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
    this.cd.detectChanges();
  }

}
