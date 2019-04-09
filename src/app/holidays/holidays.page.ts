import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { RequestHolidaysModalComponent } from '../modals/request-holidays-modal/request-holidays-modal.component';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import config from '../config/config';
import { ObjectId } from 'bson';
import { Storage } from '@ionic/storage';
import { StitchMongoService } from '../services/stitch-mongo.service';
import { Holiday } from '../models/holiday.model';
import { HolidayDetail } from '../models/holiday.detail.model';
import * as moment from 'moment';

const colors: any = {
  red: {
    primary: '#f44336',
    secondary: '#ffebee'
  },
  pink: {
    primary: '#e91e63',
    secondary: '#f8bbd0'
  },
  teal: {
    primary: '#009688',
    secondary: '#b2dfdb'
  },
  deepOrange: {
    primary: '#ff5722',
    secondary: '#ffccbc'
  },
  indigo: {
    primary: '#3f51b5',
    secondary: '#9fa8da'
  }
};

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.page.html',
  styleUrls: ['./holidays.page.scss'],
})
export class HolidaysPage implements OnInit {

  Object = Object;

   // Calendar
   eventsCalendar: CalendarEvent[] = [];
   view: CalendarView = CalendarView.Month;
   CalendarView = CalendarView;
   viewDate: Date = new Date();
   activeDayIsOpen = false;
   holidays: Holiday = null;
   infoHolidaysByType = {
    holiday: {count: 0, color: colors.indigo},
    sickness: {count: 0, color: colors.red},
    maternity: {count: 0, color: colors.teal},
    meeting: {count: 0, color: colors.deepOrange},
    home: {count: 0, color: colors.pink}
   };
   // exclude weekends
  excludeDays: number[] = [0, 6];

  constructor(private modalCtrl: ModalController, private storage: Storage, private stitchMongoService: StitchMongoService) { }

  ngOnInit() {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          console.log(result);
          if ((result.length !== 0) && (typeof result[0]['holidays'] !== 'undefined')) {
            this.holidays = result[0]['holidays'];
            this.formatEventsCalendar();
          }
        });
      }
    });
  }

  requestHolidays() {
    console.log('HolidaysPage::requestHolidays() | method called');
    this.presentModal();
  }

  async presentModal() {
    const componentProps = { modalProps: { title: 'Request time off', holidays: this.holidays }};
    const modal = await this.modalCtrl.create({
      component: RequestHolidaysModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data presentModal', data);
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('HolidaysPage::dayClicked() | method called');

    /*
    // if (isSameMonth(date, this.viewDate)) {
    if (moment(date).isSame(this.viewDate, 'month')) {
      this.viewDate = date;
      if (
        // (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        (moment(date).isSame(this.viewDate, 'day') && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
    */
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log('HolidaysPage::handleEvent() | method called');
  }

  formatEventsCalendar() {
    this.eventsCalendar = [];
    this.holidays.taken.info.map(holiday => {
      console.log(holiday);
      this.holidaysByType(holiday);
      const formattedEvent = {
        start: new Date(holiday.startDate),
        end: new Date(holiday.endDate),
        title: holiday.type,
        color: this.infoHolidaysByType[holiday.type].color,
      };
      console.log(formattedEvent);
      this.eventsCalendar.push(formattedEvent);
    });
    console.log(this.infoHolidaysByType);
  }

  holidaysByType(holiday: HolidayDetail) {
    // console.log('holidaysByType holiday', holiday);
    this.infoHolidaysByType[holiday.type].count += holiday.countDays;
  }

}
