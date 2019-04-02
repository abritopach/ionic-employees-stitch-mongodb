import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { RequestHolidaysModalComponent } from '../modals/request-holidays-modal/request-holidays-modal.component';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import config from '../config/config';
import { ObjectId } from 'bson';
import { Storage } from '@ionic/storage';
import { StitchMongoService } from '../services/stitch-mongo.service';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.page.html',
  styleUrls: ['./holidays.page.scss'],
})
export class HolidaysPage implements OnInit {

   // Calendar
   eventsCalendar: CalendarEvent[] = [];
   view: CalendarView = CalendarView.Month;
   CalendarView = CalendarView;
   viewDate: Date = new Date();
   activeDayIsOpen = false;

  constructor(private modalCtrl: ModalController, private storage: Storage, private stitchMongoService: StitchMongoService) { }

  ngOnInit() {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          console.log(result);
          if ((result.length !== 0) && (typeof result[0]['holidays'] !== 'undefined')) {
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
    const componentProps = { modalProps: { title: 'Request time off' }};
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

}
