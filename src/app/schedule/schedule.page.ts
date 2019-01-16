import { Component, OnInit, HostListener, ViewChild, TemplateRef } from '@angular/core';

import { PopoverController, ModalController } from '@ionic/angular';

import { ShowPeoplePopoverComponent } from './../popovers/show-people.popover';

import { StitchMongoService } from './../services/stitch-mongo.service';

import { ObjectId } from 'bson';

import { Storage } from '@ionic/storage';

import config from '../config/config';

import { EventModalComponent } from './../modals/event-modal/event.modal';

import { MoreOptionsPopoverComponent } from './../popovers/more-options/more-options.popover';

import * as moment from 'moment';

import { CalendarView, CalendarEvent, CalendarEventAction } from 'angular-calendar';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss']
})
export class SchedulePage implements OnInit {

  currentYear = new Date().getFullYear();
  events: any = null;
  eventsCopy: any = null;
  participants: any = [];

  // https://www.code-sample.com/2018/07/angular-6-google-maps-agm-core.html
  lat = 26.765844;
  lng = 83.364944;
  innerWidth: any;
  countPeople = 3;
  avatarColSize = 2;
  chipColSize = 2;

  option = 'today';

    // Calendar demo

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  activeDayIsOpen = false;

  showCalendarFlag = false;

  eventsCalendar: CalendarEvent[] = [];


  // **********


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // console.log(event.target.innerWidth);
    this.checkWidth(event.target.innerWidth);
    // this.people = this.peopleMore.slice(0, this.countPeople);
    this.updateParticipants();
  }

  constructor(private popoverCtrl: PopoverController, private stitchMongoService: StitchMongoService,
              private storage: Storage, private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.checkWidth(this.innerWidth);

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          if ((result.length !== 0) && (typeof result[0]['events'] !== 'undefined')) {
            this.events = this.eventsCopy = result[0]['events'];
            console.log('events', this.events);
            this.formatEventsCalendar();
            this.filterEvents('today');
            // SORT ascending events by date.
            // this.events.sort((a, b) => +moment(a.date).format('YYYYMMDD') - +moment(b.date).format('YYYYMMDD'));
            this.updateParticipants();
          }
        });
      }
    });
  }

  onClickShowPeople(event) {
    console.log('SchedulePage::onClickShowPeople | method called');
    this.presentPopover(event);
  }

  async presentPopover(event) {
    const componentProps = { popoverProps: { people: event.meeting_participants}};
    const popover = await this.popoverCtrl.create({
      component: ShowPeoplePopoverComponent,
      componentProps: componentProps
      // event: event
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
      this.popoverCtrl.dismiss();
    }

  }

  checkWidth(width) {

    // Extra small.
    if (width <= 400) {
      this.countPeople = 2;
      this.avatarColSize = 2;
      this.chipColSize = 2;
    }
    // Small.
    if ((width >= 401) && (width <= 640)) {
      this.countPeople = 3;
      this.avatarColSize = 2;
      this.chipColSize = 2;
    }
    // Medium.
    if ((width >= 641) && (width <= 1007)) {
      this.countPeople = 6;
      this.avatarColSize = 1;
      this.chipColSize = 6;
    }
    // Large.
    if ((width >= 1008) && (width <= 1199)) {
      this.countPeople = 8;
      this.avatarColSize = 1;
      this.chipColSize = 4;
    }
    // Extra Large.
    if (width >= 1200) {
      this.countPeople = 10;
      this.avatarColSize = 1;
      this.chipColSize = 2;
    }
  }

  addEvent() {
    console.log('SchedulePage::addEvent() | method called');
    this.presentModal();
  }

  async presentModal() {
    const componentProps = { modalProps: { title: 'Add event' }};
    const modal = await this.modalCtrl.create({
      component: EventModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data presentModal', data);
      console.log('events', this.events);
      // Check that the event is not empty.
      if (data._id !== '') {
        this.events = [...this.events, data];
        console.log('events', this.events);
        this.formatEventsCalendar();
        // this.events.sort((a, b) => +moment(a.date).format('YYYYMMDD') - +moment(b.date).format('YYYYMMDD'));
        this.updateParticipants();
      }

    }
  }

  onClickMoreOptions(event) {
    console.log('SchedulePage::onClickMoreOptions() | method called');
    console.log(event);
    this.presentOptionsPopover(event);
  }

  async presentOptionsPopover(event) {
    console.log('presentPopover', event);
    const componentProps = { popoverProps: { event: event}};
    const popover = await this.popoverCtrl.create({
      component: MoreOptionsPopoverComponent,
      componentProps: componentProps
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);

      if (data.option === 'delete') {
        this.eventsCopy = this.eventsCopy.filter(e => e.title !== data.event.title);
        if (this.showCalendarFlag) {
          this.eventsCalendar = this.eventsCalendar.filter(e => e.title !== data.event.title);
        }

      } else {
       const events = this.eventsCopy.map(e => {
            if (e._id === data.event._id) {
              e = data.event;
            }
            return e;
          });
          this.eventsCopy = [...events];
          this.formatEventsCalendar();
          // this.events.sort((a, b) => +moment(a.date).format('YYYYMMDD') - +moment(b.date).format('YYYYMMDD'));
          this.updateParticipants();
      }
      this.filterEvents(this.option);
    }

  }

  updateParticipants() {
    this.participants = [];
    this.eventsCopy.map(e => {
      const visibleParticipants = e.meeting_participants.slice(0, this.countPeople);
      this.participants.push(visibleParticipants);
    });
  }

  segmentChanged(event) {
    console.log(event.detail.value);
    this.filterEvents(event.detail.value);
  }

  filterEvents(option) {

    if (option === 'previous') {
      const previousEvents = this.eventsCopy.filter(event => moment(event.date).isBefore(moment()));
      console.log('previousEvents', previousEvents);
      this.events = [...previousEvents];
    }
    if (option === 'today') {
      const todayEvents = this.eventsCopy.filter(event => moment(event.date).isSame(moment()));
      console.log('todayEvents', todayEvents);
      this.events = [...todayEvents];
    }
    if (option === 'upcoming') {
      const upcomingEvents = this.eventsCopy.filter(event => moment(event.date).isAfter(moment()));
      console.log('upcomingEvents', upcomingEvents);
      this.events = [...upcomingEvents];
    }
    this.updateParticipants();
  }

  formatEventsCalendar() {
    this.eventsCalendar = [];
    console.log('events in formatEventsCalendar', this.eventsCopy);
    this.eventsCopy.map(event => {
      console.log(moment(event.date).toDate());
      const formattedEvent = { ...event,
        start: moment(event.date).toDate(),
        color: colors.red,
      };
      this.eventsCalendar.push(formattedEvent);
    });
  }

  showCalendar() {
    console.log('SchedulePage::showCalendar() | method called');
    this.showCalendarFlag = !this.showCalendarFlag;
    if (this.showCalendarFlag) {
      this.events = this.eventsCopy;
    }
    else {
      this.filterEvents(this.option);
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('SchedulePage::dayClicked() | method called');

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
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.onClickMoreOptions(event);
  }


}
