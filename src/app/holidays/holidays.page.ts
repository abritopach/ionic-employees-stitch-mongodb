import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';

import { RequestHolidaysModalComponent } from '../modals/request-holidays-modal/request-holidays-modal.component';
import { CalendarEvent } from 'angular-calendar';
import config from '../config/config';
import { ObjectId } from 'bson';
import { Storage } from '@ionic/storage';
import { StitchMongoService } from '../services/stitch-mongo.service';
import { Holiday } from '../models/holiday.model';
import { HolidayDetail } from '../models/holiday.detail.model';
import { MoreOptionsPopoverComponent } from '../popovers/more-options/more-options.popover';
import { IziToastService } from '../services/izi-toast.service';
import { HistoryHolidaysModalComponent } from '../modals/history-holidays-modal/history-holidays-modal.component';
import { RequestHolidays } from '../models/request.holidays.model';
import { UpcomingAbsencesModalComponent } from '../modals/upcoming-absences-modal/upcoming-absences-modal.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './holidays.page.html',
  styleUrls: ['./holidays.page.scss'],
})
export class HolidaysPage implements OnInit {

  Object = Object;

   // Calendar
   eventsCalendar: Array<CalendarEvent<HolidayDetail>> = [];
   excludeDays: number[] = [0, 6];
   holidays: Holiday = null;
   infoHolidaysByType = {
    holiday: {count: 0, color: colors.indigo},
    sickness: {count: 0, color: colors.red},
    maternity: {count: 0, color: colors.teal},
    meeting: {count: 0, color: colors.deepOrange},
    home: {count: 0, color: colors.pink}
   };
  employeesHolidaysRequests: RequestHolidays[] = [];

  constructor(private modalCtrl: ModalController, private storage: Storage, private stitchMongoService: StitchMongoService,
              private popoverCtrl: PopoverController, private iziToast: IziToastService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          console.log(result);
          this.employeesHolidaysRequests = result[0]['employees_holidays_requests'];
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
    const componentProps = { modalProps: { title: 'Request time off', holidays: this.holidays}};
    this.presentModal(RequestHolidaysModalComponent, componentProps);
  }

  async presentModal(component, componentProps) {
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data presentModal', data);
      this.holidays = data;
      this.infoHolidaysByType = {
        holiday: {count: 0, color: colors.indigo},
        sickness: {count: 0, color: colors.red},
        maternity: {count: 0, color: colors.teal},
        meeting: {count: 0, color: colors.deepOrange},
        home: {count: 0, color: colors.pink}
      };
      this.formatEventsCalendar();
    }
  }

  handleEvent(event): void {
    console.log('HolidaysPage::handleEvent() | method called', event);
    this.onClickMoreOptions(event);
  }

  formatEventsCalendar() {
    this.eventsCalendar = [];
    this.holidays.taken.info.map(holiday => {
      if ((holiday.status !== 'pending') && (holiday.status !== 'rejected')) {
        console.log(holiday);
        this.holidaysByType(holiday);
        const formattedEvent = {
          start: new Date(holiday.startDate),
          end: new Date(holiday.endDate),
          title: holiday.type,
          color: this.infoHolidaysByType[holiday.type].color,
          meta: holiday
        };
        console.log(formattedEvent);
        this.eventsCalendar.push(formattedEvent);
      }
    });
    this.cd.detectChanges();
    console.log(this.infoHolidaysByType);
  }

  holidaysByType(holiday: HolidayDetail) {
    // console.log('holidaysByType holiday', holiday);
    this.infoHolidaysByType[holiday.type].count += holiday.countDays;
  }

  onClickMoreOptions(event) {
    console.log('HolidaysPage::onClickMoreOptions() | method called');
    console.log(event);
    this.presentOptionsPopover(event);
  }

  async presentOptionsPopover(event) {
    console.log('presentPopover', event);

    const componentProps = { popoverProps: { title: 'Options',
      options: [
        {name: 'Update', icon: 'create', function: 'updateHolidays'},
        {name: 'Delete', icon: 'close-circle-outline', function: 'deleteHolidays'}
      ],
      event: event
    }};

    const popover = await this.popoverCtrl.create({
      component: MoreOptionsPopoverComponent,
      componentProps: componentProps
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
      if (data.option === 'updateHolidays') {
        const componentPropsModal = { modalProps: { title: 'Request time off', holidays: this.holidays,
         selectedHolidays: data.selectedHolidays}};
        this.presentModal(RequestHolidaysModalComponent, componentPropsModal);
      }
      if (data.option === 'deleteHolidays') {
        this.deleteHolidays(data.selectedHolidays);
      }
    }

  }

  deleteHolidays(selectedHolidays) {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);

        this.holidays.taken.info = this.holidays.taken.info.filter(h => h.id !== selectedHolidays.meta.id);
        this.holidays.taken.days -= selectedHolidays.meta.countDays;
        this.holidays.not_taken += selectedHolidays.meta.countDays;


        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId}, {$set: { holidays: this.holidays }})
        .then(docs => {
            console.log(docs);
            this.iziToast.success('Delete holidays', 'Holidays deleted successfully.');
            this.infoHolidaysByType = {
              holiday: {count: 0, color: colors.indigo},
              sickness: {count: 0, color: colors.red},
              maternity: {count: 0, color: colors.teal},
              meeting: {count: 0, color: colors.deepOrange},
              home: {count: 0, color: colors.pink}
            };
            this.formatEventsCalendar();
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

  showHistory() {
    const componentProps = { modalProps: { title: 'Request holidays history', holidays: this.holidays}};
    this.presentModal(HistoryHolidaysModalComponent, componentProps);
  }

  showEmployeesHolidaysRequests() {
    const componentProps = { modalProps: { title: 'Employees Requests Holidays', requests: this.employeesHolidaysRequests}};
    this.presentModal(HistoryHolidaysModalComponent, componentProps);
  }

  showUpcomingAbsences() {
    const componentProps = { modalProps: { title: 'Upcoming Employees Absences'}};
    this.presentModal(UpcomingAbsencesModalComponent, componentProps);
  }


}
