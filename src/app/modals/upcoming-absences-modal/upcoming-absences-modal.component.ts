import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ModalController } from '@ionic/angular';

import { StitchMongoService } from '../../services/stitch-mongo.service';
import config from '../../config/config';
import { Holiday } from '../../models/holiday.model';

@Component({
  selector: 'app-upcoming-absences-modal',
  templateUrl: './upcoming-absences-modal.component.html',
  styleUrls: ['./upcoming-absences-modal.component.scss'],
})
export class UpcomingAbsencesModalComponent implements OnInit {

  view = 'month';

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  // exclude weekends
  excludeDays: number[] = [0, 6];

  holidays: Holiday = null;

  constructor(private modalCtrl: ModalController, private stitchMongoService: StitchMongoService) { }

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
      if ((docs.length !== 0) && (typeof docs[0]['holidays'] !== 'undefined')) {
        this.holidays = docs[0]['holidays'];
        this.formatEventsCalendar(docs[0]['avatar']);
      }
    });
  }

  formatEventsCalendar(avatar) {
    this.events = [];
    this.holidays.taken.info.map(holiday => {
      if ((holiday.status !== 'pending') && (holiday.status !== 'rejected')) {
        console.log(holiday);
        const formattedEvent = {
          start: new Date(holiday.startDate),
          end: new Date(holiday.endDate),
          title: holiday.type,
          meta: avatar
        };
        console.log(formattedEvent);
        this.events.push(formattedEvent);
      }
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('UpcomingAbsencesModalComponent::dayClicked() | method called', date, events);
  }

}
